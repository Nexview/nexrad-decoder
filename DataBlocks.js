class VolumeDataConstantType {
  #dataBlockType;
  #dataName;
  #lrtup;
  #majorVersionNumber;
  #minorVersionNumber;
  #lat;
  #long;
  #siteHeight;
  #feedhornHeight;
  #calibrationConstant;
  #horizontalShvTxPower;
  #verticalShvTxPower;
  #systemDifferentialReflectivity;
  #initialSystemDifferentialPhase;
  #volumeCoveragePatternNumber;
  #processingStatus;

  constructor(buffer, offset) {
    buffer.seek(offset);
    this.#dataBlockType = buffer.readString(1);
    this.#dataName = buffer.readString(3);
    this.#lrtup = buffer.readInteger(2);
    this.#majorVersionNumber = buffer.readInteger(1);
    this.#minorVersionNumber = buffer.readInteger(1);
    this.#lat = buffer.readReal(4);
    this.#long = buffer.readReal(4);
    this.#siteHeight = buffer.readScaledInteger(2, 1);
    this.#feedhornHeight = buffer.readInteger(2);
    this.#calibrationConstant = buffer.readReal(4);
    this.#horizontalShvTxPower = buffer.readReal(4);
    this.#verticalShvTxPower = buffer.readReal(4);
    this.#systemDifferentialReflectivity = buffer.readReal(4);
    this.#initialSystemDifferentialPhase = buffer.readReal(4);
    this.#volumeCoveragePatternNumber = buffer.readInteger(2);
    this.#processingStatus = buffer.readInteger(2);
  }

  toJSON = (name = null) => {
    const json = {
      dataBlockType: {
        name: 'Data Block Type',
        description: 'Indicates Data Constant Type',
        value: this.#dataBlockType,
        units: null
      },
      dataName: {
        name: 'Data Name',
        description: 'Volume Data Constant Block',
        value: this.#dataName,
        units: null
      },
      lrtup: {
        name: 'LRTUP (size of data block)',
        description: 'Size of data block in bytes',
        value: this.#lrtup,
        units: null
      },
      majorVersionNumber: {
        name: 'Version Number',
        description: 'Major Change',
        value: this.#majorVersionNumber,
        units: null
      },
      minorVersionNumber: {
        name: 'Version Number',
        description: 'Minor Change',
        value: this.#minorVersionNumber,
        units: null
      },
      lat: {
        name: 'Lat',
        description: 'Latitude',
        value: this.#lat,
        units: 'deg'
      },
      long: {
        name: 'Long',
        description: 'Longitude',
        value: this.#long,
        units: 'deg'
      },
      siteHeight: {
        name: 'Site Height',
        description: 'Height of site base above sea level',
        value: this.#siteHeight,
        units: 'm'
      },
      feedhornHeight: {
        name: 'Feedhorn Height',
        description: 'Height of feedhorn above ground',
        value: this.#feedhornHeight,
        units: 'm'
      },
      calibrationConstant: {
        name: 'Calibration Constant (dBZ0)',
        description: 'Reflectivity scaling factor without correction by the ground noise scaling factors given in the adaptation data message',
        value: this.#calibrationConstant,
        units: 'dB'
      },
      horizontalShvTxPower: {
        name: 'Horizontal SHV Tx Power',
        description: 'Transmitter Power for Horizontal Channel',
        value: this.#horizontalShvTxPower,
        units: 'kW'
      },
      verticalShvTxPower: {
        name: 'Vertical SHV Tx Power',
        description: 'Transmitter Power for Vertical Channel',
        value: this.#verticalShvTxPower,
        units: 'kW'
      },
      systemDifferentialReflectivity: {
        name: 'System Differential Reflectivity',
        description: 'Calibration of system ZDR',
        value: this.#systemDifferentialReflectivity,
        units: 'dB'
      },
      initialSystemDifferentialPhase: {
        name: 'Initial System Differential Phase',
        description: 'Initial ΦDP for the system',
        value: this.#initialSystemDifferentialPhase,
        units: 'deg'
      },
      volumeCoveragePatternNumber: {
        name: 'Volume Coverage Pattern Number',
        description: 'Identifies Volume Coverage Pattern being used',
        value: this.#volumeCoveragePatternNumber,
        units: null
      },
      processingStatus: {
        name: 'Processing Status (28)',
        description: 'Processing option bits',
        value: this.#processingStatus,
        units: null
      }
    };
    if (name) {
      return json[name];
    }
    return json;
  }
};

class ElevationDataConstantType {
  #dataBlockType;
  #dataName;
  #lrtup;
  #atmos
  #calibrationConstant;

  constructor(buffer, offset) {
    buffer.seek(offset);
    this.#dataBlockType = buffer.readString(1);
    this.#dataName = buffer.readString(3);
    this.#lrtup = buffer.readInteger(2);
    this.#atmos = buffer.readScaledInteger(2, 0.001);
    this.#calibrationConstant = buffer.readReal(4);
  }

  toJSON = (name = null) => {
    const json = {
      dataBlockType: {
        name: 'Data Block Type',
        description: 'Indicates Data Constant Type',
        value: this.#dataBlockType,
        units: null
      },
      dataName: {
        name: 'Data Name',
        description: 'Volume Data Constant Block',
        value: this.#dataName,
        units: null
      },
      lrtup: {
        name: 'LRTUP (size of data block)',
        description: 'Size of data block in bytes',
        value: this.#lrtup,
        units: null
      },
      atmos: {
        name: 'ATMOS',
        description: 'Atmospheric Attenuation Factor',
        value: this.#atmos,
        units: null
      },

      calibrationConstant: {
        name: 'Calibration Constant (dBZ0)',
        description: 'Scaling constant used by the Signal Processor for this elevation to calculate reflectivity',
        value: this.#calibrationConstant,
        units: 'dB'
      }
    };
    if (name) {
      return json[name];
    }
    return json;
  }
};

class RadialDataConstantType {
  #dataBlockType;
  #dataName;
  #lrtup;
  #unambiguousRange;
  #horizontalNoiseLevel;
  #verticalNoiseLevel;
  #nyquistVelocity;
  #horizontalCalibrationConstant;
  #verticalCalibrationConstant;

  constructor(buffer, offset) {
    buffer.seek(offset);
    this.#dataBlockType = buffer.readString(1);
    this.#dataName = buffer.readString(3);
    this.#lrtup = buffer.readInteger(2);
    this.#unambiguousRange = buffer.readScaledInteger(2, 0.1);
    this.#horizontalNoiseLevel = buffer.readReal(4);
    this.#verticalNoiseLevel = buffer.readReal(4);
    this.#nyquistVelocity = buffer.readScaledInteger(2, 0.01);
    buffer.skip(2);
    this.#horizontalCalibrationConstant = buffer.readReal(4);
    this.#verticalCalibrationConstant = buffer.readReal(4);
  }

  toJSON = (name = null) => {
    const json = {
      dataBlockType: {
        name: 'Data Block Type',
        description: 'Indicates Data Constant Type',
        value: this.#dataBlockType,
        units: null
      },
      dataName: {
        name: 'Data Name',
        description: 'Volume Data Constant Block',
        value: this.#dataName,
        units: null
      },
      lrtup: {
        name: 'LRTUP (size of data block)',
        description: 'Size of data block in bytes',
        value: this.#lrtup,
        units: null
      },
      unambiguousRange: {
        name: 'Unambiguous Range',
        description: 'Unambiguous range, Interval Size',
        value: this.#unambiguousRange,
        units: 'km'
      },
      horizontalNoiseLevel: {
        name: 'Noise Level',
        description: 'Horizontal Channel',
        value: this.#horizontalNoiseLevel,
        units: 'dBm'
      },
      verticalNoiseLevel: {
        name: 'Noise Level',
        description: 'Vertical Channel',
        value: this.#verticalNoiseLevel,
        units: 'dBm'
      },
      nyquistVelocity: {
        name: 'Nyquist Velocity',
        description: 'Nyquist Velocity',
        value: this.#nyquistVelocity,
        units: 'm/s'
      },
      horizontalCalibrationConstant: {
        name: 'Calibration Constant (dBZ0)',
        description: 'Horizontal Channel',
        value: this.#horizontalCalibrationConstant,
        units: 'dBZ'
      },
      verticalCalibrationConstant: {
        name: 'Calibration Constant (dBZ0)',
        description: 'Vertical Channel',
        value: this.#verticalCalibrationConstant,
        units: 'dBZ'
      }
    };
    if (name) {
      return json[name];
    }
    return json;
  }
};

class GenericDataMomentType {
  #dataBlockType;
  #dataMomentName;
  #numberOfDataMomentGates;
  #dataMomentRange;
  #dataMomentRangeSampleInterval;
  #tover;
  #snrThreshold;
  #controlFlags;
  #dataWordSize;
  #scale;
  #offset;
  #dataMoments = [];

  constructor(buffer, offset) {
    buffer.seek(offset);
    this.#dataBlockType = buffer.readString(1);
    this.#dataMomentName = buffer.readString(3);
    buffer.skip(4);
    this.#numberOfDataMomentGates = buffer.readInteger(2);
    this.#dataMomentRange = buffer.readScaledInteger(2, 0.001);
    this.#dataMomentRangeSampleInterval = buffer.readScaledInteger(2, 0.001);
    this.#tover = buffer.readScaledInteger(2, 0.1);
    this.#snrThreshold = buffer.readScaledSInteger(2, 0.125);
    this.#controlFlags = buffer.readCode(1);
    this.#dataWordSize = buffer.readInteger(1);
    this.#scale = buffer.readReal(4);
    this.#offset = buffer.readReal(4);
    for (let i = 0; i < this.#getSize(); i++) {
      this.#dataMoments[i] = this.#scaleData(buffer.readInteger(1));
    }
  }

  toJSON = (name = null) => {
    const json = {
      dataBlockType: {
        name: 'Data Block Type',
        description: 'Indicates Data Moment Type',
        value: this.#dataBlockType,
        units: null
      },
      dataMomentName: {
        name: 'Data Moment Name',
        description: 'Name of data moment',
        value: this.#dataMomentName,
        units: null
      },
      numberOfDataMomentGates: {
        name: 'Number of Data Moment Gates',
        description: 'Number of data moment gates for the current radial (NG)',
        value: this.#numberOfDataMomentGates,
        units: null
      },
      dataMomentRange: {
        name: 'Data Moment Range',
        description: 'Range to center of first range gate',
        value: this.#dataMomentRange,
        units: 'km'
      },
      dataMomentRangeSampleInterval: {
        name: 'Data Moment Range Sample Interval',
        description: 'Size of data moment sample interval',
        value: this.#dataMomentRangeSampleInterval,
        units: 'km'
      },
      tover: {
        name: 'TOVER',
        description: 'Threshold parameter which specifies the minimum difference in echo power between two resolution gates for them not to be labeled "overlayed"',
        value: this.#tover,
        units: 'dB'
      },
      snrThreshold: {
        name: 'SNR Threshold',
        description: 'SNR threshold for valid data',
        value: this.#snrThreshold,
        units: 'dB'
      },
      controlFlags: {
        name: 'Control Flags',
        description: 'Indicates special control features',
        value: this.#controlFlags,
        units: null
      },
      dataWordSize: {
        name: 'Data Word Size',
        description: 'Number of bits (DWS) used for storing data for each Data Moment gate',
        value: this.#dataWordSize,
        units: null
      },
      scale: {
        name: 'Scale',
        description: 'Scale value used to convert Data Moments from integer to floating point data',
        value: this.#scale,
        units: null
      },
      offset: {
        name: 'Offset',
        description: 'Offset value used to convert Data Moments from integer to floating point data',
        value: this.#offset,
        units: null
      },
      dataMoments: {
        name: 'Data Moments',
        description: 'Variable length array of data moments',
        value: this.#dataMoments,
        units: 'dBZ'
      }
    };
    if (name) {
      return json[name];
    }
    return json;
  }

  #getSize = () => {
    return (this.#numberOfDataMomentGates * this.#dataWordSize) / 8;
  }

  #scaleData = (rawValue) => {
    return (rawValue - this.#offset) / this.#scale;
  }
};

exports.VolumeDataConstantType = VolumeDataConstantType;
exports.ElevationDataConstantType = ElevationDataConstantType;
exports.RadialDataConstantType = RadialDataConstantType;
exports.GenericDataMomentType = GenericDataMomentType;