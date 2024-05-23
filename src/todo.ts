import { filterAnnotations, sortAnnotations, sortEntities } from './helpers';
import { outputSchema } from './schemas';
import { Annotation, Entity, Input } from './types/input';
import { ConvertedAnnotation, ConvertedEntity, Output } from './types/output';

export const convertInput = (input: Input): Output => {
  const documents = input.documents.map((document) => {
    const documentEntities = document.entities;
    const entities = documentEntities.map(convertEntity(documentEntities)).sort(sortEntities);

    const documentAnnotations = document.annotations;
    const annotations = documentAnnotations
      .filter(filterAnnotations)
      .map(convertAnnotation(documentAnnotations, entities))
      .sort(sortAnnotations);

    return { id: document.id, entities, annotations };
  });

  return { documents };
};

const convertEntity =
  (documentEntities: Entity[]) =>
  (entity: Entity): ConvertedEntity => {
    const children = documentEntities
      .filter((documentEntity) => documentEntity.refs.includes(entity.id))
      .map(convertEntity(documentEntities))
      .sort(sortEntities);

    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      class: entity.class,
      children,
    };
  };

const convertAnnotation =
  (documentAnnotations: Annotation[], entities: ConvertedEntity[]) =>
  (annotation: Annotation): ConvertedAnnotation => {
    const entity = entities.find((entity) => entity.id === annotation.entityId);

    if (!entity) {
      throw new Error(`No entity was for annotation with id: ${annotation.id}`);
    }

    const children = documentAnnotations
      .filter((documentAnnotation) => documentAnnotation.refs.includes(annotation.id))
      .map(convertAnnotation(documentAnnotations, entities))
      .sort(sortAnnotations);

    const index = annotation.indices?.[0]?.start ?? (children.length ? children[0].index : -1);
    const { id, name } = entity;

    return {
      id: annotation.id,
      entity: { id, name },
      value: annotation.value,
      index,
      children,
    };
  };

export const validateOutput = (output: Output): boolean => outputSchema.isValidSync(output);
