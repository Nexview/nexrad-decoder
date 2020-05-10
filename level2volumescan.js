const { logger } = require('./logger');
const fs = require('fs');
const moment = require('moment-timezone');
const Bzip2 = require('seek-bzip');

class Level2VolumeScan {
  raf;
  #position = 0;
  constructor(path) {
    // fs.writeFileSync('/Users/alexneises/KTWX20200504_075325_V06_decoded', Level2VolumeScan.#decodeFile(path));
    // this.raf = Level2VolumeScan.#decodeFile(path);
    this.raf = fs.readFileSync('/Users/alexneises/KTWX20200504_075325_V06_decoded');

    // HEADER BLOCK
    const tape = this.#readString(9); // tape
    const extension = this.#readString(3); // extension
    const daysSinceEpoch = this.#readWord(); // days since unix epoch
    const millisSinceMidnight = this.#readWord(); // milliseconds since midnight
    const site = this.#readString(4); // site identifier

    console.log('tape', tape);
    console.log('extension', extension);
    console.log(Level2VolumeScan.#formatDate(daysSinceEpoch, millisSinceMidnight));
    console.log('site', site);

    // METADATA BLOCK
    // Message 15 - 77 segments (187264 bytes)

    this.#position += 325888 + 28;

    console.log('site', this.#readString(4));
    const millis = this.#readInteger(4);
    const julian = this.#readInteger(2);
    console.log(Level2VolumeScan.#formatDate(julian, millis));
    console.log('azimuthNumber', this.#readInteger(2));
    console.log('azimuthAngle', this.#readReal(4));
    console.log('compressionIndicator', this.#readCode(1));
    this.#position++;
    console.log('radialLength', this.#readInteger(2));
    console.log('azimuthSpacing', this.#readCode(1));
    console.log('radialStatus', this.#readCode(1));
    console.log('elevationNumber', this.#readInteger(1));
    console.log('cutSectorNumber', this.#readInteger(1));
    console.log('elevationAngle', this.#readReal(4));
    console.log('radialSpotBlankingStatus', this.#readCode(1));
    console.log('azimuthIndexingMode', this.#readScaledInteger(1, 0.01));
    console.log('dataBlockCount', this.#readInteger(2));
    const prevPos = this.#position;
    // console.log('dataBlockPointer', this.#readInteger(4));
    this.#position += this.#readInteger(4);
    console.log(this.#readString(1));
    // console.log('dataBlockPointer', this.#readInteger(4));
    // console.log('dataBlockPointer', this.#readInteger(4));
    // console.log('dataBlockPointer', this.#readInteger(4));
    // console.log('dataBlockPointer', this.#readInteger(4));
    // console.log('dataBlockPointer', this.#readInteger(4));
    // console.log('dataBlockPointer', this.#readInteger(4));
    // console.log('dataBlockPointer', this.#readInteger(4));
    // console.log('dataBlockPointer', this.#readInteger(4));
    // this.#position++;
    // console.log(this.raf.toString('binary', this.#position, this.#position + 1));
    // this.#position++;
    // console.log(this.raf.toString('hex', this.#position, this.#position + 1));
    // console.log('idSeq', this.#readHalfWord());
    // console.log('meta15date', this.#readHalfWord());
    // console.log('meta15time', this.#readWord());
    // console.log('meta15elev', this.#readHalfWord());
  }

  #readCode = (size) => {
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

  #readInteger = (size) => {
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

  #readScaledInteger = (size, precision) => {
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

  #readReal = (size) => {
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

  static #decodeFile = (input) => {
    const decoder = fs.readFileSync(input);
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

  static #formatDate = (days, millis, fmt = null) => {
    return new moment.tz('1969-12-31 23:59:59', 'GMT')
      .add(days, 'days')
      .startOf('day')
      .add(millis, 'milliseconds')
      .tz('America/Chicago')
      .format(fmt ? fmt : 'YYYY-MM-DD HH:mm:ss zz');
  }

  #readByte = () => {
    const pos = this.#position;
    this.#position += 1;
    try {
      return this.raf[pos];
    } catch (e) {
      logger.error(e);
      process.exit(1);
    }
  }

  #readString = (size) => {
    const pos = this.#position;
    this.#position += size;
    try {
      return this.raf.toString('utf8', pos, pos + size);
    } catch (e) {
      logger.error(e);
    }
  }
}

exports.Level2VolumeScan = Level2VolumeScan;