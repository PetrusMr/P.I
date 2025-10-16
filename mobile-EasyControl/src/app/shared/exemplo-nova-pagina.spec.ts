import { exemploDocumentacao } from './exemplo-nova-pagina';

describe('ExemploDocumentacao', () => {
  it('should have documentation', () => {
    expect(exemploDocumentacao).toBeTruthy();
    expect(exemploDocumentacao.html).toBeTruthy();
    expect(exemploDocumentacao.typescript).toBeTruthy();
    expect(exemploDocumentacao.propriedades).toBeTruthy();
  });
});