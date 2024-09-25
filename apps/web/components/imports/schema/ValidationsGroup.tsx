import { Group } from '@mantine/core';
import { Badge } from '@ui/badge';
import { getColorForText } from '@shared/utils';
import { ValidationTypesEnum } from '@impler/client';
import { ColumnTypesEnum, IColumn } from '@impler/shared';

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
      <Badge key={ValidationTypesEnum.RANGE} color="green" variant="filled">
        Range: {min}-{max}
      </Badge>
    );

  if (typeof min === 'number')
    return (
      <Badge key={ValidationTypesEnum.RANGE} color="green" variant="filled">
        Min: {min}
      </Badge>
    );

  if (typeof max === 'number')
    return (
      <Badge key={ValidationTypesEnum.RANGE} color="green" variant="filled">
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
      {item.validations?.map((validation) => {
        if (validation.validate === ValidationTypesEnum.UNIQUE_WITH) {
          return (
            <Badge variant="filled" key={ValidationTypesEnum.UNIQUE_WITH} color={getColorForText(validation.uniqueKey)}>
              Unique with: {validation.uniqueKey}
            </Badge>
          );
        } else if (validation.validate === ValidationTypesEnum.RANGE) {
          return <MinMaxValidationBadge min={validation.min} max={validation.max} key={ValidationTypesEnum.RANGE} />;
        } else if (validation.validate === ValidationTypesEnum.LENGTH) {
          return <MinMaxValidationBadge min={validation.min} max={validation.max} key={ValidationTypesEnum.LENGTH} />;
        }
      }) || []}
    </Group>
  );
}
