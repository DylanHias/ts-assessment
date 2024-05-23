import { expect } from 'chai';
import { filterAnnotations, sortAnnotations, sortEntities } from '.';
import { Annotation, EntityClass, EntityType } from '../types/input';
import { ConvertedAnnotation, ConvertedEntity } from '../types/output';

const setup = () => {
  const entityA: ConvertedEntity = {
    id: '65afd280db285265fae6c728',
    name: 'invoice number',
    type: EntityType.REGULAR,
    class: EntityClass.TEXT,
    children: [],
  };

  const entityB: ConvertedEntity = {
    id: '65afd45bdb285265fae6ca90',
    name: 'article',
    type: EntityType.REGULAR,
    class: EntityClass.RELATION,
    children: [],
  };

  const annotationA: ConvertedAnnotation = {
    id: '65afd64a45977d96c2ebc9fc',
    children: [],
    entity: { id: '65afd280db285265fae6c728', name: 'invoice number' },
    value: 'INV 20277107"',
    index: 55,
  };

  const annotationB: ConvertedAnnotation = {
    id: '65afdaf8db285265fae6dfb2',
    children: [],
    entity: { id: '65afd45bdb285265fae6ca90', name: 'article' },
    value: null,
    index: 72,
  };

  const annotationWithoutRefs: Annotation = {
    id: 'id',
    entityId: 'entityId',
    refs: [],
    value: null,
    indices: null,
    entityExtractionConfidence: null,
    ocrConfidence: null,
    confidence: null,
    rawValue: null,
    parsedValue: null,
    source: 'MANUAL',
    user: null,
    checked: null,
    image: null,
    coords: null,
  };

  const annotationWithRefs: Annotation = {
    id: 'id',
    entityId: 'entityId',
    refs: ['idA', 'idB'],
    value: null,
    indices: null,
    entityExtractionConfidence: null,
    ocrConfidence: null,
    confidence: null,
    rawValue: null,
    parsedValue: null,
    source: 'MANUAL',
    user: null,
    checked: null,
    image: null,
    coords: null,
  };

  return {
    entityA,
    entityB,
    annotationA,
    annotationB,
    annotationWithoutRefs,
    annotationWithRefs,
  };
};

describe('Helpers', () => {
  describe('sortEntities', () => {
    it('should return index 1', () => {
      // arrange
      const { entityA, entityB } = setup();

      // act
      const result = sortEntities(entityA, entityB);

      // assert
      expect(result).to.equal(1);
    });

    it('should return index -1', () => {
      // arrange
      const { entityA, entityB } = setup();

      // act
      const result = sortEntities(entityB, entityA);

      // assert
      expect(result).to.equal(-1);
    });
  });

  describe('sortAnnotations', () => {
    it('should return index 1', () => {
      // arrange
      const { annotationA, annotationB } = setup();

      // act
      const result = sortAnnotations(annotationB, annotationA);

      // assert
      expect(result).to.equal(1);
    });

    it('should return index -1', () => {
      // arrange
      const { annotationA, annotationB } = setup();

      // act
      const result = sortAnnotations(annotationA, annotationB);

      // assert
      expect(result).to.equal(-1);
    });
  });

  describe('filterAnnotations', () => {
    it('should return false if there are refs present inside the annotation ', () => {
      // arrange
      const { annotationWithRefs } = setup();

      // act
      const result = filterAnnotations(annotationWithRefs);

      // assert
      expect(result).to.be.false;
    });

    it('should return true if no refs are present inside the annotation ', () => {
      // arrange
      const { annotationWithoutRefs } = setup();

      // act
      const result = filterAnnotations(annotationWithoutRefs);

      // assert
      expect(result).to.be.true;
    });
  });
});
