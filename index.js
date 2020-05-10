const fs = require('fs');
// const { Level2Record } = require('./Nexrad');
// const { Level2VolumeScan } = require('./Level2VolumeScan');

const { Binary } = require('./binary');
const {
  VolumeDataConstantType,
  ElevationDataConstantType,
  RadialDataConstantType,
  GenericDataMomentType
} = require('./DataBlocks');
const { ClutterFilterMap } = require('./Metadata');
const bin = new Binary(Binary.decodeFile('/Users/alexneises/KTWX20200507_185801_V06'));
console.log(bin.readString(9));
console.log(bin.readString(3));
const scanDay = bin.readInteger(4);
const scanTime = bin.readInteger(4);
console.log(Binary.formatDate(scanDay, scanTime));
console.log(bin.readString(4));

// const clutterFilterMap = new ClutterFilterMap(bin, bin.getPosition() + 12);
// console.log(clutterFilterMap.toJSON());
// fs.writeFileSync('/Users/alexneises/nexrad-decoder/clutter.json', JSON.stringify(clutterFilterMap.toJSON()));

bin.skip(134 * 2432); // Skip metadata
bin.skip(28);
const initialPosition = bin.getPosition();
bin.readString(4);
// console.log(bin.readString(4)); // 0-3
const collectionTime = bin.readInteger(4); // 4-7
const collectionDate = bin.readInteger(2); // 8-9
// console.log(Binary.formatDate(collectionDate, collectionTime));
const azimuthNumber = bin.readInteger(2); // 10-11
const azimuthAngle = bin.readReal(4); // 12-15
const compressionIndicator = bin.readCode(1); // 16
bin.skip(1); // 17
const radialLength = bin.readInteger(2); // 18-19
const azimuthResolutionSpacing = bin.readCode(1); // 20
const radialStatus = bin.readCode(1); // 21
const elevationNumber = bin.readInteger(1); // 22
const cutSectorNumber = bin.readInteger(1); // 23
const elevationAngle = bin.readReal(4); // 24-27
const radialSpotBlankingStatus = bin.readCode(1); // 28
const azimuthIndexingMode = bin.readScaledInteger(1, 0.01); // 29
const dataBlockCount = bin.readInteger(2); // 30-31
const positionBeforePointer = bin.getPosition();
const currentPos = bin.getPosition();
const volumeDCTpointer = bin.readInteger(4); // 32-35
// const volPosition = bin.getPosition() + volumeDCTpointer;
const elevationDCTpointer = bin.readInteger(4);
const radialDCTpointer = bin.readInteger(4);
const refPointer = bin.readInteger(4);
const velPointer = bin.readInteger(4);
// // const velPosition = bin.getPosition() + velPointer;
const swPointer = bin.readInteger(4);
const zdrPointer = bin.readInteger(4);
// const phiPointer = bin.readInteger(4);
// const rhoPointer = bin.readInteger(4);
// bin.skip(10);
// const initialPosition = bin.getPosition();
// console.log(bin.readString(4)); // 0-3
let refData = [];
const numScans = azimuthResolutionSpacing === 1 ? 360 / 0.5 : 360;
let latitude, longitude, distance, size;
for (let i = 0; i < numScans; i++) {
  const volumeDataConstantType = new VolumeDataConstantType(bin, initialPosition + volumeDCTpointer);
  // console.log(volumeDataConstantType.toJSON());
  const elevationDataConstantType = new ElevationDataConstantType(bin, initialPosition + elevationDCTpointer);
  // console.log(elevationDataConstantType.toJSON());
  const radialDataConstantType = new RadialDataConstantType(bin, initialPosition + radialDCTpointer);
  // console.log(radialDataConstantType.toJSON());
  const genericDataMomentTypeRad = new GenericDataMomentType(bin, initialPosition + refPointer);
  // console.log(genericDataMomentType.toJSON());
  const genericDataMomentTypeVel = new GenericDataMomentType(bin, initialPosition + velPointer);

  const genericDataMomentTypeSw = new GenericDataMomentType(bin, initialPosition + swPointer);

  const genericDataMomentTypeZdr = new GenericDataMomentType(bin, initialPosition + zdrPointer);
  latitude = volumeDataConstantType.toJSON('lat').value;
  longitude = volumeDataConstantType.toJSON('long').value;
  distance = genericDataMomentTypeRad.toJSON('dataMomentRange').value;
  size = genericDataMomentTypeRad.toJSON('dataMomentRangeSampleInterval').value;
  refData[i] = genericDataMomentTypeRad.toJSON('dataMoments');
}
console.log('azimuthAngle', azimuthAngle);
console.log('latitude', latitude);
console.log('longitude', longitude);
console.log('distance', distance);
console.log('size', size);
console.log(refData[0].value);

// fs.writeFileSync('/Users/alexneises/nexrad-decoder/ref.json', JSON.stringify(refData));

// console.log(bin.readString(4));