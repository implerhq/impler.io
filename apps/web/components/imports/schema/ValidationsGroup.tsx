import { ColumnTypesEnum, IColumn, ValidatorTypesEnum } from '@impler/shared';
import { Group } from '@mantine/core';
import { Badge } from '@ui/badge';
import { getColorForText } from '@shared/utils';

interface IValidationsGroupProps {
  item: IColumn;
}

interface IMinMaxValidationBadgeProps {
  min?: number;
  max?: number;
}

function MinMaxValidationBadge({ max, min }: IMinMaxValidationBadgeProps) {
  if (typeof min === 'number' && typeof max === 'number')
    return (
      <Badge key={ValidatorTypesEnum.RANGE} color="green" variant="filled">
        Range: {min}-{max}
      </Badge>
    );

  if (typeof min === 'number')
    return (
      <Badge key={ValidatorTypesEnum.RANGE} color="green" variant="filled">
        Min: {min}
      </Badge>
    );

  if (typeof max === 'number')
    return (
      <Badge key={ValidatorTypesEnum.RANGE} color="green" variant="filled">
        Max: {max}
      </Badge>
    );

  return null;
}

export function ValidationsGroup({ item }: IValidationsGroupProps) {
  return (
    <Group spacing={5}>
      {item.isRequired && <Badge variant="outline">Required</Badge>}
      {item.type !== ColumnTypesEnum.SELECT && item.isUnique && (
        <Badge color="cyan" variant="outline">
          Unique
        </Badge>
      )}
      {item.type === ColumnTypesEnum.SELECT && item.allowMultiSelect && (
        <Badge color="green" variant="outline">
          Multi Select
        </Badge>
      )}
      {item.validators?.map((validator) => {
        if (validator.validate === ValidatorTypesEnum.UNIQUE_WITH) {
          return (
            <Badge variant="filled" key={ValidatorTypesEnum.UNIQUE_WITH} color={getColorForText(validator.uniqueKey!)}>
              Unique with: {validator.uniqueKey}
            </Badge>
          );
        } else if (validator.validate === ValidatorTypesEnum.RANGE) {
          return <MinMaxValidationBadge min={validator.min} max={validator.max} key={ValidatorTypesEnum.RANGE} />;
        } else if (validator.validate === ValidatorTypesEnum.LENGTH) {
          return <MinMaxValidationBadge min={validator.min} max={validator.max} key={ValidatorTypesEnum.LENGTH} />;
        }
      }) || []}
    </Group>
  );
}
