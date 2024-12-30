const { Converter, Application, CommentTag } = require("typedoc");
const tests = require("../devextreme/artifacts/specs.json");

module.exports.load = function load(application) {
  application.on(Application.EVENT_BOOTSTRAP_END, () => {
    application.options.setValue("blockTags", [
      ...new Set([
        ...application.options.getValue("blockTags"),
        "@jestspec",
        "@screenshot",
      ]),
    ]);
  });

  application.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context) => {
    Object.values(context.project.reflections).forEach((r) => {
      const comment = r.comment;

      if (comment) {
        const specComment = comment.blockTags.find(
          (tag) => tag.tag === "@jestspec"
        );

        if (specComment) {
          const filename = r.sources[0].fullFileName.replace(".ts", ".test.ts");
          const specs = tests.testResults
            .find((t) => t.name === filename)
            .assertionResults.filter(
              (res) =>
                res.ancestorTitles
                  .filter((t) => !t.startsWith("when"))
                  .join(".") === r.name
            );
          specs.forEach((spec) => {
            comment.summary.push({
              kind: "text",
              text: `${spec.title}\n\n`,
            });
          });
        }
      }

      if (comment) {
        const screenshotComment = comment.blockTags.find(
          (tag) => tag.tag === "@screenshot"
        );

        if (screenshotComment) {

          console.log(screenshotComment)
          comment.summary.push({
            kind: 'text',
            text: `<img src="${screenshotComment.content[0].text}"></img>\n\n`
          })
        }
      }
    });
  });
};
