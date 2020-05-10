class Level2Record {
  static REFLECTIVITY = 1;
  static VELOCITY_HI = 2;
  static VELOCITY_LOW = 4;
  static SPECTRUM_WIDTH = 3;
  static DOPPLER_RESOLUTION_LOW_CODE = 4;
  static HORIZONTAL_BEAM_WIDTH = 1.5;
  static REFLECTIVITY_HIGH = 5;
  static VELOCITY_HIGH = 6;
  static SPECTRUM_WIDTH_HIGH = 7;
  static DIFF_REFLECTIVITY_HIGH = 8;
  static DIFF_PHASE = 9;
  static CORRELATION_COEFFICIENT = 10;
  static MISSING_DATA = 1;
  static BELOW_THRESHOLD = 0;
  static FILE_HEADER_SIZE = 24;

  static #CTM_HEADER_SIZE = 12;
  static #MESSAGE_HEADER_SIZE = 28;
  static #RADAR_DATA_SIZE = 2432;

  recno; // record number within the file
  message_offset; // offset of start of message
  hasReflectData;
  hasDopplerData;
  hasHighResREFData;
  hasHighResVELData;
  hasHighResSWData;
  hasHighResZDRData;
  hasHighResPHIData;
  hasHighResRHOData;

  // message header
  message_size;
  id_channel;
  message_type;
  id_sequence;
  mess_julian_date;
  mess_msecs;
  seg_count;
  seg_number;

  // radar data header
  data_msecs;
  data_julian_date;
  unamb_range;
  azimuth_ang;
  radial_num; // radial number within the elevation - starts with one
  radial_status;
  elevation_ang;
  elevation_num;

  reflect_first_gate; // distance to first reflectivity gate (m)
  reflect_gate_size; // reflectivity gate size (m)
  reflect_gate_count; // number of reflectivity gates

  doppler_first_gate; // distance to first reflectivity gate (m)
  doppler_gate_size; // reflectivity gate size (m)
  doppler_gate_count; // number of reflectivity gates

  cut;
  calibration; // system gain calibration constant (db biased)
  resolution; // doppler velocity resolution
  vcp; // volume coverage pattern

  nyquist_vel; // nyquist velocity
  attenuation; // atmospheric attenuation factor
  threshold; // threshold parameter for minimum difference
  ref_snr_threshold; // reflectivity signal to noise threshold
  vel_snr_threshold;
  sw_snr_threshold;
  zdrHR_snr_threshold;
  phiHR_snr_threshold;
  rhoHR_snr_threshold;
  ref_rf_threshold; // reflectivity range folding threshold
  vel_rf_threshold;
  sw_ref_threshold;
  zdrHR_rf_threshold;
  phiHR_rf_threshold;
  rhoHR_rf_threshold;

  #reflect_offset; // reflectivity data pointer (byte number from start of message)
  #velocity_offset; // velocity data pointer (byte number from start of message)
  #spectWidth_offset; // spectrum-width data pointer (byte number from start of message)

  // new addition for message type 31
  rlength;
  id;
  azimuth;
  compressIdx;
  sp;
  ars;
  rs;
  elevation;
  rsbs;
  aim;
  dcount;

  dbp1;
  dbp2;
  dbp3;
  dbp4;
  dbp5;
  dbp6;
  dbp7;
  dbp8;
  dbp9;
  reflectHR_gate_count;
  velocityHR_gate_count;
  spectrumHR_gate_count;
  reflectHR_scale;
  velocityHR_scale;
  spectrumHR_scale;
  zdrHR_scale;
  phiHR_scale;
  rhoHR_scale;
  reflectHR_addoffset;
  velocityHR_addoffset;
  spectrumHR_addoffset;
  zdrHR_addoffset;
  phiHR_addoffset;
  rhoHR_addoffset;
  reflectHR_offset;
  velocityHR_offset;
  spectrumHR_offset;
  zdrHR_offset;
  phiHR_offset;
  rhoHR_offset;
  zdrHR_gate_count;
  phiHR_gate_count;
  rhoHR_gate_count;
  reflectHR_gate_size;
  velocityHR_gate_size;
  spectrumHR_gate_size;
  zdrHR_gate_size;
  phiHR_gate_size;
  rhoHR_gate_size;
  reflectHR_first_gate;
  velocityHR_first_gate;
  spectrumHR_first_gate;
  zdrHR_first_gate;
  phiHR_first_gate;
  rhoHR_first_gate;

  static getDatatypeName(datatype) {
    switch (datatype) {
      case this.REFLECTIVITY:
        return 'Reflectivity';
      case this.VELOCITY_HI:
      case this.VELOCITY_LOW:
        return 'RadialVelocity';
      case this.SPECTRUM_WIDTH:
        return 'SpectrumWidth';
      case this.REFLECTIVITY_HIGH:
        return 'Reflectivity_HI';
      case this.VELOCITY_HIGH:
        return 'RadialVelocity_HI';
      case this.SPECTRUM_WIDTH_HIGH:
        return 'SpectrumWidth_HI';
      case this.DIFF_REFLECTIVITY_HIGH:
        return 'Reflectivity_DIFF';
      case this.DIFF_PHASE:
        return 'Phase';
      case this.CORRELATION_COEFFICIENT:
        return 'RHO';
      default:
        throw new Error('Illegal Argument');
    }
  }

  static getDatatypeUnits(datatype) {
    switch (datatype) {
      case this.REFLECTIVITY:
      case this.REFLECTIVITY_HIGH:
      case this.DIFF_REFLECTIVITY_HIGH:
        return 'dBz';
      case this.VELOCITY_HI:
      case this.VELOCITY_LOW:
      case this.SPECTRUM_WIDTH:
      case this.VELOCITY_HIGH:
      case this.SPECTRUM_WIDTH_HIGH:
        return 'm/s';
      case this.DIFF_PHASE:
        return 'deg';
      case this.CORRELATION_COEFFICIENT:
        return 'N/A';
      default:
        throw new Error('Illegal Argument');
    }
  }

  getDatatypeSNRThreshold(datatype) {
    switch (datatype) {
      case this.REFLECTIVITY_HIGH:
        return this.ref_snr_threshold;
      case this.VELOCITY_HIGH:
        return this.vel_snr_threshold;
      case this.SPECTRUM_WIDTH_HIGH:
        return this.sw_snr_threshold;
      case this.DIFF_REFLECTIVITY_HIGH:
        return this.zdrHR_snr_threshold;
      case this.DIFF_PHASE:
        return this.phiHR_snr_threshold;
      case this.CORRELATION_COEFFICIENT:
        return this.rhoHR_snr_threshold;
      default:
        throw new Error('Illegal Argument');
    }
  }

  getDatatypeRangeFoldingThreshold(datatype) {
    switch (datatype) {
      case this.REFLECTIVITY_HIGH:
        return this.ref_rf_threshold;
      case this.VELOCITY_HIGH:
        return this.vel_rf_threshold;
      case this.SPECTRUM_WIDTH_HIGH:
        return this.sw_ref_threshold;
      case this.REFLECTIVITY:
      case this.VELOCITY_LOW:
      case this.VELOCITY_HI:
      case this.SPECTRUM_WIDTH:
        return this.threshold;
      case this.DIFF_REFLECTIVITY_HIGH:
        return this.zdrHR_rf_threshold;
      default:
        throw new Error('Illegal Argument');
    }
  }

  getDatatypeScaleFactor(datatype) {
    switch (datatype) {
      case this.REFLECTIVITY:
      case this.VELOCITY_HI:
      case this.SPECTRUM_WIDTH:
        return 0.5;
      case this.VELOCITY_LOW:
        return 1.0;
      case this.REFLECTIVITY_HIGH:
        return 1 / this.reflectHR_scale;
      case this.VELOCITY_HIGH:
        return 1 / this.velocityHR_scale;
      case this.SPECTRUM_WIDTH_HIGH:
        return 1 / this.spectrumHR_scale;
      case this.DIFF_REFLECTIVITY_HIGH:
        return 1.0 / this.phiHR_scale;
      case this.CORRELATION_COEFFICIENT:
        return 1.0 / this.rhoHR_scale;
      default:
        throw new Error('Illegal Argument');
    }
  }

  getDatatypeAddOffset(datatype) {
    switch (datatype) {
      case this.REFLECTIVITY:
        return -33.0;
      case this.VELOCITY_LOW:
        return -129.0;
      case this.VELOCITY_HI:
      case this.SPECTRUM_WIDTH:
        return -64.5;
      case this.REFLECTIVITY_HIGH:
        return this.reflectHR_addoffset * (-1) / this.reflectHR_scale;
      case this.VELOCITY_HIGH:
        return this.velocityHR_addoffset * (-1) / this.velocityHR_scale;
      case this.SPECTRUM_WIDTH_HIGH:
        return this.spectrumHR_addoffset * (-1) / this.spectrumHR_scale;
      case this.DIFF_REFLECTIVITY_HIGH:
        return this.zdrHR_addoffset * (-1) / this.zdrHR_scale;
      case this.DIFF_PHASE:
        return this.phiHR_addoffset * (-1) / this.phiHR_scale;
      case this.CORRELATION_COEFFICIENT:
        return this.rhoHR_addoffset * (-1) / this.rhoHR_scale;
      default:
        throw new Error('Illegal Argument');
    }
  }

  static getMessageTypeName(code) {
    switch (code) {
      case 1:
        return 'digital radar data';
      case 2:
        return 'RDA status data';
      case 3:
        return 'performance/maintainence data';
      case 4:
        return 'console message - RDA to RPG';
      case 5:
        return 'maintainence log data';
      case 6:
        return 'RDA control commands';
      case 7:
        return 'volume coverage pattern';
      case 8:
        return 'clutter censor zones';
      case 9:
        return 'request for data';
      case 10:
        return 'console message - RPG to RDA';
      case 11:
        return 'loop back test - RDA to RPG';
      case 12:
        return 'loop back test -RPG to RDA';
      case 13:
        return 'clutter filter bypass map - RDA to RPG';
      case 14:
        return 'edited clutter filter bypass map - RDA to RPG';
      case 15:
        return 'Notchwidth Map';
      case 18:
        return 'RDA Adaptation data';
      case 31:
        return 'Digital Radar Data Generic Format';
      default:
        return `unknown ${ code }`;
    }
  }

  static getRadialStatusName(code) {
    switch (code) {
      case 0:
        return 'start of new elevation';
      case 1:
        return 'intermediate radial';
      case 2:
        return 'end of elevation';
      case 3:
        return 'begin volume scan';
      case 4:
        return 'end volume scan';
      default:
        return `unknown ${ code }`;
    }
  }

  static getVolumeCoveragePatternName(code) {
    switch (code) {
      case 11:
        return '16 elevation scans every 5 minutes';
      case 12:
        return '14 elevation scans every 4.1 minutes';
      case 21:
        return '11 elevation scans every 6 minutes';
      case 31:
        return '8 elevation scans every 10 minutes';
      case 32:
        return '7 elevation scans every 10 minutes';
      case 121:
        return '9 elevations, 20 scans every 5 minutes';
      case 211:
        return '14 elevations, 16 scans every 5 minutes';
      case 212:
        return '14 elevations, 17 scans every 4 minutes';
      case 221:
        return '9 elevations, 11 scans every 5 minutes';
      default:
        return `unknown ${ code }`;
    }
  }

  static getDate(julianDays, msecs) {
    return new Date((julianDays - 1) * 24 * 3600 * 1000 + Number(msecs));
  }

  static factory(din, record, message_offset31) {
    try {
      const offset = record * Level2Record.#RADAR_DATA_SIZE + Level2Record.FILE_HEADER_SIZE + message_offset31;
      if (offset >= din.length()) {
        return null;
      } else {
        return new Level2Record(din, record, message_offset31);
      }
    } catch (e) {
      throw e;
    }
  }

  constructor(din, record, message_offset31) {
    try {
      this.recno = record;
      this.message_offset = record * Level2Record.#RADAR_DATA_SIZE + Level2Record.FILE_HEADER_SIZE + message_offset31;
      console.log(din.readInt32LE(0));
    } catch (e) {
      throw e;
    }
  }
}

exports.Level2Record = Level2Record;