import * as React from 'react';
import { IPublicTypeAssetsJson, IPublicTypeSnippet } from '@alilc/lowcode-types';

export interface IAssets extends IPublicTypeAssetsJson {
  groupList: any;
}

interface I18nString {
  type: 'i18n';
  [key: string]: string;
}

export type Text = string | I18nString;

export interface SortMeta {
  category?: Text;
  group?: Text;
  hidden?: boolean;
  priority?: number;
}

export interface SnippetMeta {
  id?: string;
  componentName: string;
  title: Text;
  screenshot?: string | React.ReactNode;
  schema: any;
}

export interface StandardComponentMeta extends SortMeta {
  componentName: Text;
  icon: string | React.ReactNode;
  title: Text;
  description: Text;
  category?: Text;
  keywords?: Text[];
  sort?: SortMeta;
  snippets?: SnippetMeta[];
}

export interface StandardMeta {
  componentList: StandardComponentMeta[];
  groupList: Text[];
}

export interface SortedGroups {
  categories: Array<{
    name: Text;
    priority: number;
    components: StandardComponentMeta[];
  }>;
  [key: string]: any
  name: Text;
}


export default function transform(raw: IAssets) {
  const t = getTextReader('zh_CN');
  let groupList: Text[] = [];
  let categoryList: Text[] = [];
  let componentList = [];

  if (raw?.groupList?.length) {
    groupList = raw.groupList;
  } else {
    groupList = [createI18n('组件', 'Components')];
  }

  const snippets: Array<SnippetMeta | IPublicTypeSnippet> = [];
  const groups: SortedGroups[] = [];
  // 如果 assets 有 sort 属性，则表示为符合新协议规范的 assets
  if (raw?.sort?.groupList && raw?.sort?.categoryList) {
    const map = {} as any;
    groupList = raw.sort.groupList;
    categoryList = raw.sort.categoryList;
    // 过滤未申明category的物料，不会在物料面板显示
    componentList = raw.components?.filter(component => component?.category);

    componentList.forEach((component) => {
      component.snippets?.forEach(snippet => {
        snippet.id = `${t(component.group)}_${t(component.category)}_${component.componentName}_${snippet.title}`;
        snippets.push(snippet);
      });
      const { group = createI18n('默认分组', 'DefaultGroup'), category, priority: componentPriority = 0 } = component;
      component.group = group;
      component.priority = componentPriority;
      const indexOfCategory = categoryList.indexOf(category!);
      const categoryPriority = indexOfCategory === -1 ? -1 : categoryList.length - indexOfCategory;
      if (!map[t(group)]) {
        const groupIndex = groupList.indexOf(group);
        const groupPriority = groupIndex === -1 ? -1 : (groupList.length - groupIndex);
        const obj = {
          name: group,
          content: {},
          categories: [],
          priority: groupPriority
        };

        map[t(group)] = obj;
        groups.push(obj);
      }
      const currentGroup = map[t(group)];
      if (!currentGroup.content[t(category)]) {
        const cateObj = {
          components: [],
          name: category,
          priority: categoryPriority,
        };
        currentGroup.content[t(category)] = cateObj;
        currentGroup.categories.push(cateObj);
      }
      const currentCategory = currentGroup.content[t(category)];
      currentCategory.components.push(component);
    });
  } else if (raw?.componentList?.length) {
    const map = {} as any;
    const visibleComponentList = raw.componentList.filter(component => component.category);
    componentList = pipe(visibleComponentList)
      .pipe(flatten)
      .pipe(formatSort)
      .pipe(formatSnippets)
      .pipe((stdComponent: StandardComponentMeta) => {
        const { sort } = stdComponent;
        if (stdComponent.snippets?.length) {
          stdComponent.snippets.forEach(snippet => {
            snippet.id = `${t(sort?.group)}_${t(sort?.category)}_${snippet.componentName}_${snippet.title}`;
            snippets.push(snippet);
          });
        }
        return [stdComponent];
      })
      .pipe((stdComponent: StandardComponentMeta) => {
        const { sort } = stdComponent;
        const { group, category, priority = 0 } = sort;

        const hasGroup = textExistIn(group, groupList);

        if (hasGroup) {
          if (!map[t(group)]) {
            const groupIndex = groupList.indexOf(group);
            const groupPriority = groupIndex === -1 ? -1 : (groupList.length - groupIndex);
            const obj = {
              name: group,
              content: {},
              categories: [],
              priority: groupPriority
            };

            map[t(group)] = obj;
            groups.push(obj);
          }
          const currentGroup = map[t(group)];
          if (!currentGroup.content[t(category)]) {
            const cateObj = {
              components: [],
              name: category,
              priority,
            };
            currentGroup.content[t(category)] = cateObj;
            currentGroup.categories.push(cateObj);
          }
          const currentCategory = currentGroup.content[t(category)];

          currentCategory.components.push(stdComponent);
        }

        return [stdComponent];
      })
      .run();
  }

  groups.sort((a, b) => {
    return b.priority - a.priority;
  });

  groups.forEach((group) => {
    if (!group.categories || !group.categories.length) {
      return;
    }
    group.categories.sort((a, b) => {
      return b.priority - a.priority;
    });
    group.categories = group.categories.map(category => {
      category?.components?.sort((a, b) => {
        return (b.priority || 0) - (a.priority || 0);
      });
      return category;
    });
  });

  return {
    groupList,
    componentList,
    groups,
    snippets,
  };
}

function flatten(item) {
  if (typeof item === 'object') {
    // 带children，当做分组处理
    if (item?.children?.length) {
      return item.children.map((c) => ({
        category: item.title,
        ...c,
      }));
    }

    if (item.componentName) {
      return [item];
    }
  }
  return [];
}

function formatSort(item) {
  const { sort = {} } = item;
  const category = sort.category || item.category;
  const useDefaultCategory = !category;

  item.sort = {
    group: createI18n('组件', 'Components'),
    ...sort,
    category: category || createI18n('其他', 'Others'),
    priority: useDefaultCategory ? -1 : sort.priority,
  };

  if (item.sort.hidden) {
    return [];
  }

  return [item];
}

function formatSnippets(item) {
  item.snippets = item.snippets || [];

  if (item.snippets.length === 0) {
    item.snippets = [
      {
        componentName: item.componentName,
        schema: {
          componentName: item.componentName,
          props: item.props || item.defaultProps || {},
        },
      },
    ];
  }

  item.snippets = pipe(item.snippets)
    .pipe((snippet) => {
      if (!snippet.schema) {
        return [];
      }
      if (!snippet.screenshot) {
        snippet.screenshot = item.icon;
      }
      if (!snippet.componentName) {
        snippet.componentName = item.componentName;
      }
      return [snippet];
    })
    .run();
  return [item];
}

export function getTextReader(lang: string) {
  return (input?: Text): string => {
    if (typeof input === 'string') {
      return input;
    }
    if (typeof input === 'object' && input.type === 'i18n') {
      return input[lang];
    }
    return '';
  };
}

export function createI18n(zh_CN, en_US): Text {
  return {
    zh_CN,
    en_US,
    type: 'i18n',
  };
}

export function pipe(arr: any[]) {
  const fns = [];

  const last = (ret) => ret;

  function run(buffer, fn, next) {
    if (!buffer?.length) {
      return [];
    }
    const push = [...buffer];
    const pop = [];
    for (const item of push) {
      const result = fn(item) || [];
      const data = next(result) || [];
      pop.push(...data);
    }
    return pop;
  }

  return {
    pipe(fn: (item: any) => any[]) {
      fns.push(fn);
      return this;
    },
    run() {
      const process = [...fns, last].reduceRight((next, fn) => {
        return (input) => run(input, fn, next);
      });
      return process(arr);
    },
  };
}

export function textExistIn(text: Text, arr: Text[]) {
  const t = getTextReader('zh_CN');
  return !!arr.find((item) => t(item) === t(text));
}
