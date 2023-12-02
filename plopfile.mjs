/** @param {import('plop').NodePlopAPI} plop */
export default function (plop) {
  plop.setHelper('formatPath', (directory, subdirectory) => {
    if (subdirectory) {
      return `${directory}/${subdirectory}`;
    }
    return directory;
  });

  plop.setGenerator('component', {
    description: 'Create a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name',
      },
      {
        type: 'list',
        name: 'directory',
        message: 'Select the target directory',
        choices: ['components/base', 'components/features'],
      },
      {
        type: 'input',
        name: 'subdirectory',
        message: 'Enter a subdirectory path (options)',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{formatPath directory subdirectory}}/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'plop-templates/Component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/{{formatPath directory subdirectory}}/{{pascalCase name}}/{{pascalCase name}}.stories.tsx',
        templateFile: 'plop-templates/Component.stories.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/{{formatPath directory subdirectory}}/{{pascalCase name}}/{{pascalCase name}}.module.css',
        templateFile: 'plop-templates/Component.module.css.hbs',
      },
    ],
  });
}
