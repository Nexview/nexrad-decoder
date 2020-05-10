const fs = require('fs');
const Bzip2 = require('seek-bzip');
const moment = require('moment-timezone');
const { logger } = require('./logger');

class Binary {
  #raf;
  #position = 0;
  constructor(buffer) {
    this.#raf = buffer;
  }

  #readByte = () => {
    const pos = this.#position;
    this.#position += 1;
    try {
      return this.#raf[pos];
    } catch (e) {
      logger.error(e);
      process.exit(1);
    }
  }

  getPosition = () => {
    return this.#position;
  }

  getBuffer = () => {
    return this.#raf.buffer;
  }

  getLength = () => {
    return this.#raf.length;
  }

  seek = (val) => {
    if (isNaN(val) || val < 0) {
      logger.error(new Error('size invalid'));
      process.exit(1);
    }
    this.#position = val;
  }

  skip = (val) => {
    if (isNaN(val) || val <= 0) {
      logger.error(new Error('size invalid'));
      process.exit(1);
    }
    this.#position += val;
  }

  readRawBite = () => {
    return this.#raf[this.#position];
  }

  readCode = (size) => {
    if (size !== 1 && size !== 2) {
      logger.error(new Error('size invalid'));
      process.exit(1);
    }
    const buffer = new ArrayBuffer(size);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < size; i++) {
      bytes[i] = this.#readByte();
    }
    const view = new DataView(buffer);
    return size === 1 ? view.getInt8(0) : view.getInt16(0, false);
  }

  readInteger = (size) => {
    if (size !== 1 && size !== 2 && size !== 4) {
      logger.error(new Error('size invalid'));
      process.exit(1);
    }
    const buffer = new ArrayBuffer(size);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < size; i++) {
      bytes[i] = this.#readByte();
    }
    const view = new DataView(buffer);
    switch (size) {
      case 1:
        return view.getUint8(0);
      case 2:
        return view.getUint16(0, false);
      default:
        return view.getUint32(0, false);
    }
  }

  readScaledInteger = (size, precision) => {
    if (size !== 1 && size !== 2 && size !== 4) {
      logger.error(new Error('size invalid'));
      process.exit(1);
    }
    const buffer = new ArrayBuffer(size);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < size; i++) {
      bytes[i] = this.#readByte();
    }
    const view = new DataView(buffer);
    switch (size) {
      case 1:
        return view.getUint8(0) * precision;
      case 2:
        return view.getUint16(0, false) * precision;
      default:
        return view.getUint32(0, false) * precision;
    }
  }

  readScaledSInteger = (size, precision) => {
    if (size !== 1 && size !== 2 && size !== 4) {
      logger.error(new Error('size invalid'));
      process.exit(1);
    }
    const buffer = new ArrayBuffer(size);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < size; i++) {
      bytes[i] = this.#readByte();
    }
    const view = new DataView(buffer);
    switch (size) {
      case 1:
        return view.getInt8(0) * precision;
      case 2:
        return view.getInt16(0, false) * precision;
      default:
        return view.getInt32(0, false) * precision;
    }
  }

  readReal = (size) => {
    if (size !== 4 && size !== 8) {
      logger.error(new Error('size invalid'));
      process.exit(1);
    }
    const buffer = new ArrayBuffer(size);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < size; i++) {
      bytes[i] = this.#readByte();
    }
    const view = new DataView(buffer);
    return size === 4 ? view.getFloat32(0, false) : view.getFloat64(0, false);
  }

  readString = (size) => {
    const pos = this.#position;
    this.#position += size;
    try {
      return this.#raf.toString('utf8', pos, pos + size);
    } catch (e) {
      logger.error(e);
      process.exit(1);
    }
  }

  static decodeFile = (file) => {
    const decoder = fs.readFileSync(file);
    let decoderPos = 0;

    const bufferArray = [];
    let totalLength = 0;

    const headerSize = 24;
    const headerBuf = Buffer.from(decoder.buffer, decoderPos, headerSize);
    bufferArray.push(headerBuf);
    totalLength += headerBuf.length;
    decoderPos += 24;
    let processor = true;
    while (processor) {
      const compressionSize = decoder.readInt32BE(decoderPos);
      decoderPos += 4;
      const buf = Buffer.from(decoder.buffer, decoderPos, compressionSize);
      try {
        const decoded = Bzip2.decode(buf);
        bufferArray.push(decoded);
        totalLength += decoded.length;
        decoderPos += compressionSize;
      } catch (e) {
        const footerBuf = Buffer.from(decoder.buffer, decoderPos, decoder.length - decoderPos);
        bufferArray.push(footerBuf);
        totalLength += footerBuf.length;
        processor = false;
      }
    }
    const buff = Buffer.concat(bufferArray, totalLength);
    return buff;
  }

  static formatDate = (days, millis, fmt = null) => {
    return new moment.tz('1969-12-31 23:59:59', 'GMT')
      .add(days, 'days')
      .startOf('day')
      .add(millis, 'milliseconds')
      .tz('America/Chicago')
      .format(fmt ? fmt : 'YYYY-MM-DD HH:mm:ss zz');
  }
}

exports.Binary = Binary;