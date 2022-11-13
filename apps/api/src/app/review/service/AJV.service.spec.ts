import { ColumnTypesEnum } from '@impler/shared';
import { expect } from 'chai';
import { AJVService } from './AJV.service';

describe('AJV Service', () => {
  let ajvService = new AJVService();
  describe('isRequired', () => {
    it('should mark data invalid if value is empty', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a", key: "username", isRequired: true, name: "Username", type: ColumnTypesEnum.STRING }],
        [{ _columnId: "a", columnHeading: "username" }],
        [{ username: "" }]
      );
      expect(validationResult.invalid.length).to.equal(1);
      expect(validationResult.invalid[0].message).to.equal("`username` must not be empty");
      expect(validationResult.valid.length).to.equal(0);
    });
    it('should mark data invalid if value is empty for number type', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a", key: "id", isRequired: true, name: "ID", type: ColumnTypesEnum.NUMBER }],
        [{ _columnId: "a", columnHeading: "id" }],
        [{ id: "" }]
      );
      expect(validationResult.invalid.length).to.equal(1);
      expect(validationResult.invalid[0].message).to.include("`id` must not be empty");
      expect(validationResult.valid.length).to.equal(0);
    });
    it('should mark data valid if value is not empty', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a",  key: "username", isRequired: true, name: "Username", type: ColumnTypesEnum.STRING }],
        [{ _columnId: "a", columnHeading: "username" }],
        [{ username: "test" }]
      );
      expect(validationResult.invalid.length).to.equal(0);
      expect(validationResult.valid.length).to.equal(1);
    });
  });
  describe('isUnique', () => {
    it('should mark data invalid if value is not unique', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a",  key: "username", isUnique: true, name: "Username", type: ColumnTypesEnum.STRING }],
        [{ _columnId: "a", columnHeading: "username" }],
        [{ username: "test" }, { username: "test" }]
      );
      expect(validationResult.invalid.length).to.equal(1);
      expect(validationResult.invalid[0].message).to.equal("`username` must be unique");
      expect(validationResult.valid.length).to.equal(1);
    });
    it('should mark data valid if value is unique', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a",  key: "username", isUnique: true, name: "Username", type: ColumnTypesEnum.STRING }],
        [{ _columnId: "a", columnHeading: "username" }],
        [{ username: "test" }, { username: "test2" }]
      );
      expect(validationResult.invalid.length).to.equal(0);
      expect(validationResult.valid.length).to.equal(2);
    });
  });
  describe("Email", () => {
    it('should mark data invalid if value is not a valid email', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a", key: "regemail", name: "Email", type: ColumnTypesEnum.EMAIL }],
        [{ _columnId: "a", columnHeading: "regemail" }],
        [{ regemail: "test" }]
      );
      expect(validationResult.invalid.length).to.equal(1);
      expect(validationResult.invalid[0].message).to.equal("`regemail` must be a valid email");
      expect(validationResult.valid.length).to.equal(0);
    });
    it('should mark data valid if value is a valid email', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a", key: "regemail", name: "Email", type: ColumnTypesEnum.EMAIL }],
        [{ _columnId: "a", columnHeading: "regemail" }],
        [{ regemail: "test@gmail.com" }]
      );
      expect(validationResult.invalid.length).to.equal(0);
      expect(validationResult.valid.length).to.equal(1);
    });
  })
  describe("Regex", () => {
    it('should mark data invalid if value does not match regex', () => {
      const pattern = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$";
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a", key: "regemail", name: "Email", type: ColumnTypesEnum.REGEX, regex: "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$" }],
        [{ _columnId: "a", columnHeading: "regemail" }],
        [{ regemail: "test" }]
      );
      expect(validationResult.invalid.length).to.equal(1);
      expect(validationResult.invalid[0].message).to.include('`regemail`' + ` must match the pattern /${pattern}/`);
      expect(validationResult.valid.length).to.equal(0);
    });
    it('should mark data valid if value matches regex', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a", key: "regemail", name: "Email", type: ColumnTypesEnum.REGEX, regex: "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$" }],
        [{ _columnId: "a", columnHeading: "regemail" }],
        [{ regemail: "test@gmail.com" }]
      );
      expect(validationResult.invalid.length).to.equal(0);
      expect(validationResult.valid.length).to.equal(1);
    });
  });
  describe("Number", () => {
    it('should mark data invalid if value is not a number', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a", key: "id", name: "ID", type: ColumnTypesEnum.NUMBER }],
        [{ _columnId: "a", columnHeading: "id" }],
        [{ id: "test" }]
      );
      expect(validationResult.invalid.length).to.equal(1);
      expect(validationResult.invalid[0].message).to.equal("`id` must be number");
      expect(validationResult.valid.length).to.equal(0);
    });
    it('should mark data valid if value is a number', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a", key: "id", name: "ID", type: ColumnTypesEnum.NUMBER }],
        [{ _columnId: "a", columnHeading: "id" }],
        [{ id: 1 }]
      );
      expect(validationResult.invalid.length).to.equal(0);
      expect(validationResult.valid.length).to.equal(1);
    });    
  });
  describe("Date", () => {
    it('should mark data invalid if value is not a date', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a", key: "dob", name: "Date of Birth", type: ColumnTypesEnum.DATE }],
        [{ _columnId: "a", columnHeading: "dob" }],
        [{ dob: "test" }]
      );
      expect(validationResult.invalid.length).to.equal(1);
      expect(validationResult.invalid[0].message).to.equal("`dob` must be a valid date");
      expect(validationResult.valid.length).to.equal(0);
    });
    it('should mark data valid if value is a date', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a", key: "dob", name: "Date of Birth", type: ColumnTypesEnum.DATE }],
        [{ _columnId: "a", columnHeading: "dob" }],
        [{ dob: "2020-01-01" }]
      );
      expect(validationResult.invalid.length).to.equal(0);
      expect(validationResult.valid.length).to.equal(1);
    });
  });
  describe('Select', () => {
    it('should mark data invalid if value is not in select options', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a", key: "gender", name: "Gender", type: ColumnTypesEnum.SELECT, selectValues: ['Male', 'Female'] }],
        [{ _columnId: "a", columnHeading: "gender" }],
        [{ gender: "abcd" }]
      );
      expect(validationResult.invalid.length).to.equal(1);
      expect(validationResult.invalid[0].message).to.equal("`gender` must be from [Male,Female]");
      expect(validationResult.valid.length).to.equal(0);
    });
    it('should mark data valid if value is in select options', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a", key: "gender", name: "Gender", type: ColumnTypesEnum.SELECT, selectValues: ['Male', 'Female'] }],
        [{ _columnId: "a", columnHeading: "gender" }],
        [{ gender: "Male" }]
      );
      expect(validationResult.invalid.length).to.equal(0);
      expect(validationResult.valid.length).to.equal(1);
    });
  });
  describe('Any', () => {
    it('should mark data valid if value is any', () => {
      let validationResult = ajvService.validate(
        // @ts-ignore
        [{ _id: "a", key: "any", name: "Any", type: ColumnTypesEnum.ANY }],
        [{ _columnId: "a", columnHeading: "any" }],
        [{ any: "test" }, { any: 1 }, { any: "2020-01-01" }]
      );
      expect(validationResult.invalid.length).to.equal(0);
      expect(validationResult.valid.length).to.equal(3);
    });
  })
})
