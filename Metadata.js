class ClutterFilterMap {
  #mapGenerationDate;
  #mapGenerationTime;
  #numberOfElevationSegments;
  #elevtionSegments = [];

  constructor(buffer, offset) {
    buffer.seek(offset);
    this.#mapGenerationDate = buffer.readInteger(2);
    this.#mapGenerationTime = buffer.readInteger(2);
    this.#numberOfElevationSegments = buffer.readInteger(2);
    for (let e = 0; e < this.#numberOfElevationSegments; e++) {
      const azimuth = [];
      for (let r = 0; r < 360; r++) {
        const rangeZones = [];
        const numberOfRangeZones = buffer.readInteger(2);
        for (let i = 0; i < numberOfRangeZones; i++) {
          const opCode = buffer.readCode(2);
          const endRange = buffer.readInteger(2);
          while (endRange !== 511) {
            console.log('endRange', endRange);
            rangeZones.push({
              opCode,
              endRange
            });
          }
        }
        azimuth.push({
          rangeZones
        });
      }
      this.#elevtionSegments.push({
        azimuth
      });
    }
  }

  toJSON = (name = null) => {
    const json = {
      mapGenerationDate: {
        name: 'Map Generation Date',
        description: 'Julian Date - 2440586.5',
        value: this.#mapGenerationDate,
        units: 'd'
      },
      mapGenerationTime: {
        name: 'Map Generation Time',
        description: 'Number of Minutes since Midnight Greenwich Mean Time',
        value: this.#mapGenerationTime,
        units: 'min'
      },
      numberOfElevationSegments: {
        name: 'Number of Elevation Segments',
        description: 'Number of elevation segments in map',
        value: this.#numberOfElevationSegments,
        units: null
      },
      elevationSegments: {
        value: this.#elevtionSegments
      }
    };
    if (name) {
      return json[name];
    }
    return json;
  }
};

exports.ClutterFilterMap = ClutterFilterMap;