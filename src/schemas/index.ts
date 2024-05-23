import { ObjectSchema, array, lazy, mixed, number, object, string } from 'yup';
import { EntityClass, EntityType } from '../types/input';
import { ConvertedAnnotation, ConvertedEntity } from '../types/output';

const entitySchema: ObjectSchema<ConvertedEntity> = object().shape({
  id: string().required(),
  name: string().required(),
  type: string<EntityType>().required(),
  class: string<EntityClass>().required(),
  children: array()
    .of(lazy(() => entitySchema))
    .required(),
});

const annotationSchema: ObjectSchema<ConvertedAnnotation> = object().shape({
  id: string().required(),
  entity: object()
    .shape({
      id: string().required(),
      name: string().required(),
    })
    .required(),
  value: mixed<string | number>().required().nullable(),
  index: number().required(),
  children: array()
    .of(lazy(() => annotationSchema))
    .required(),
});

export const outputSchema = object().shape({
  documents: array().of(
    object().shape({
      id: string(),
      entities: array().of(entitySchema),
      annotations: array().of(annotationSchema),
    }),
  ),
});
