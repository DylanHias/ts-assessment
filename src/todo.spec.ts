import { expect } from 'chai';
import inputJson from './input.json';
import outputJson from './output.json';
import { convertInput } from './todo';
import { Input } from './types/input';
import { isOutputValid } from './helpers';

describe('Todo', () => {
  it('should be able to convert the input (flat lists) to the output (nested) structure', () => {
    // arrange & act
    const output = convertInput(inputJson as Input);

    // assert
    expect(output.documents.length).to.equal(1);
    expect(output.documents[0].entities.length).to.equal(14);
    expect(output.documents[0].annotations.length).to.equal(9);
    expect(output).to.deep.equal(outputJson);
  });

  it('should validate the output json', () => {
    // arrange
    const output = convertInput(inputJson as Input);

    // act
    const result = isOutputValid(output);

    // assert
    expect(result).to.be.true;
  });
});
