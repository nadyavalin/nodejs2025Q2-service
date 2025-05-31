import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { BadRequestException } from '@nestjs/common';

@ValidatorConstraint({ name: 'StrictType', async: false })
export class StrictTypeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [type] = args.constraints;
    if (type === 'string' && typeof value !== 'string') {
      throw new BadRequestException(`${args.property} must be a string`);
    }
    if (type === 'boolean' && typeof value !== 'boolean') {
      throw new BadRequestException(`${args.property} must be a boolean`);
    }
    return true;
  }
}
