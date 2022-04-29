const templates: Record<string, string | Promise<string>> = {};

export const getTemplate = async (url: string): Promise<string> => {
  if (!templates[url]) {
    templates[url] = fetch(url)
      .then((res) => res.text())
      .then((html: string) => {
        templates[url] = html;
        return html;
      });
  }

  return await templates[url];
};
