import path from 'path';
import { convertLessError, getLessImports } from '../src/less-utils';

describe('less-utils', () => {
  it('get imports paths', () => {
    const filePath = path.resolve(__dirname, '../example/styles/style.less');
    const imports = getLessImports(filePath);

    expect(imports).toEqual(
      expect.arrayContaining([
        expect.stringContaining('styles/style-2.less'),
        expect.stringContaining('styles/inner/style-3.less'),
        expect.stringContaining('styles/inner/style-4.css'),
        expect.stringContaining('styles/inner/style-5.css'),
      ]),
    );
  });

  it('get imports paths fail', () => {
    const filePath = path.resolve(__dirname, '../example/styles/unknown-file.less');
    const imports = getLessImports(filePath);

    expect(imports).toEqual([]);
  });

  it('converts less error into esbuild error', () => {
    const lessError = {
      type: 'Name',
      message: 'variable @some-undefined-var is undefined',
      filename: '/Users/imedvedev/projects/esbuild-plugin-less/example/styles/style-2.less',
      index: 63,
      line: 4,
      column: 14,
      extract: ['.style-2-less {', '  background: @some-undefined-var;', '  color: red;'],
    };

    const error = convertLessError(lessError);

    expect(error).toMatchObject({
      text: lessError.message,
      location: {
        namespace: 'file',
        file: lessError.filename,
        line: lessError.line,
        column: lessError.column,
        lineText: lessError.extract[1],
      },
    });
  });
});
