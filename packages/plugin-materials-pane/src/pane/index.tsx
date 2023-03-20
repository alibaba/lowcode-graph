import * as React from "react";
import ReactDOM from 'react-dom';
import { createElement } from "react";
import { Search } from "@alifd/next";
import { PluginProps } from "@alilc/lowcode-types";
import cls from 'classnames/bind';
import debounce from "lodash.debounce";
import style from "./index.module.scss";
import IconOfPane from "./Icon";
import Category from "./components/Category";
import List from "./components/List";
import Component from "./components/Component";
import Tab from "./components/Tab";
// import DragGhost from './components/DragGhost';
import ComponentManager from "./store";
import transform, {
  getTextReader,
  SortedGroups,
  Text,
} from "./utils/transform";
import { material, common, project, event } from "@alilc/lowcode-engine";

const store = new ComponentManager();
const cx = cls.bind(style);

// interface ComponentPaneProps extends PluginProps {
  // [key: string]: any;
// }

interface ComponentPaneState {
  groups: SortedGroups[];
  filter: SortedGroups[];
  keyword: string;
}

export default class ComponentPane extends React.Component<
  any,
  ComponentPaneState
> {
  static displayName = "LowcodeComponentPane";

  static defaultProps = {
    lang: "zh_CN",
  };

  state: ComponentPaneState = {
    groups: [],
    filter: [],
    keyword: "",
  };

  store = store;

  t: (input: Text) => string;

  getStrKeywords: (keywords: Text[]) => string;

  // x6GraphDom: any;

  getFilteredComponents = debounce(() => {
    const { groups = [], keyword } = this.state;
    if (!keyword) {
      this.setState({
        filter: groups,
      });
      return;
    }

    const filter = groups.map((group) => ({
      ...group,
      categories: group.categories
        .map((category) => ({
          ...category,
          components: category.components.filter((c) => {
            const strTitle = this.t(c.title);
            const strComponentName = this.t(c.componentName);
            const strDescription = this.t(c.description);
            const strKeywords = this.getStrKeywords(c.keywords);
            const keyToSearch =
              `${strTitle}#${strComponentName}#${strDescription}#${strKeywords}`.toLowerCase();
            return keyToSearch.includes(keyword);
          }),
        }))
        .filter((c) => c?.components?.length),
    }));

    this.setState({
      filter,
    });
  }, 200);

  // const updateState = (async () => {
  //   const response = await fetch('https://httpbin.org/get');
  //   const data = await response.json();
  //   setOrigin(data?.origin ?? '');
  // }, []);

  constructor(props) {
    super(props);
    this.t = getTextReader(props.lang);
    this.getStrKeywords = (keywords: Text[]): string => {
      if (typeof keywords === "string") {
        return keywords;
      }
      if (keywords && Array.isArray(keywords) && keywords.length) {
        return keywords.map((keyword) => this.t(keyword)).join("-");
      }
      return "";
    };
  }

  componentDidMount() {
    const { material, event, dragon } = this.props;
    // console.log('editor', editor);
    // if (!editor) {
    //   this.initComponentList();
    //   return;
    // }
    const assets = material.getAssets();
    if (assets) {
      this.initComponentList();
    } else {
      console.warn(
        "[ComponentsPane]: assets not ready, wait for assets ready event."
      );
    }
    event.on("trunk.change", this.initComponentList.bind(this));
    material.onChangeAssets(this.initComponentList.bind(this));

    // const getGraphDom = setInterval(() => {
    //   if (this.x6GraphDom) {
    //     this.x6GraphDom.style.width="100%";
    //     this.forceUpdate();
    //     clearInterval(getGraphDom);
    //   } else {
    //     this.x6GraphDom = document.querySelector('.x6-graph');
    //   }
    // },300);

  }

  /**
   * 初始化组件列表
   * TODO: 无副作用，可多次执行
   */
  initComponentList() {
    const { material } = this.props;
    const rawData = material.getAssets();

    const meta = transform(rawData);

    const { groups, snippets } = meta;

    this.store.setSnippets(snippets);

    this.setState({
      groups,
      filter: groups,
    });
  }

  registerAdditive = (shell: HTMLDivElement | null) => {
    const { dragon, project } = this.props;
    if (!shell || shell.dataset.registered) {
      return;
    }

    function getSnippetId(elem: any) {
      if (!elem) {
        return null;
      }
      while (shell !== elem) {
        if (elem.classList.contains("snippet")) {
          return elem.dataset.id;
        }
        elem = elem.parentNode;
      }
      return null;
    }

    const _dragon = dragon;
    if (!_dragon) {
      return;
    }

    // eslint-disable-next-line
    const click = (e: Event) => {};

    shell.addEventListener("click", click);

    let dragTarget: any;
    _dragon.from(shell, (e: Event) => {
      // const div = document.createElement('div');
      // div.className="lc-ghost-container";
      // this.x6GraphDom.parentNode.appendChild(div);
      // ReactDOM.render(<DragGhost dragon={dragon}  material={material}/>, div);

      const doc = project.getCurrentDocument();
      const id = getSnippetId(e.target);
      if (!doc || !id) {
        return null;
      }

      dragTarget = {
        type: 'nodedata',
        data: this.store.getSnippetById(id)
      };

      return dragTarget;
    });

    _dragon.onDrag((e: any) => {
      const position = (window as any)._X6Graph.pageToLocal(
        e.globalX,
        e.globalY
      );
      dragTarget.data.props.position = {
        x: position.x,
        y: position.y,
      };
    });

    _dragon.onDragend(() => {
      // const mainAreaDom = this.x6GraphDom.parentNode;
      // mainAreaDom.removeChild(mainAreaDom.lastChild);

      const doc = project.getCurrentDocument();
      const node = doc?.createNode(dragTarget.data);
      const rootNode = project.currentDocument?.root;
      project.currentDocument?.insertNode(rootNode!, node);
    });

    shell.dataset.registered = "true";
  };

  handleSearch = (keyword = "") => {
    this.setState({
      keyword: keyword.toLowerCase(),
    });
    this.getFilteredComponents();
  };

  renderEmptyContent() {
    return (
      <div className={cx("empty")}>
        <img src="//g.alicdn.com/uxcore/pic/empty.png" />
        <div className={cx("content")}>暂无动作</div>
      </div>
    );
  }

  renderCategorys(group, categories) {
    return (
      <div
        ref={this.registerAdditive}
        style={{ overflow: "scroll" }}
      >
        {categories.map((category) => {
          const { components } = category;
          const cname = this.t(category.name);
          return (
            <Category key={cname} name={cname}>
              <List>
                {components.map((component) => {
                  const { componentName, snippets = [] } = component;
                  return snippets
                    .filter((snippet) => snippet.id)
                    .map((snippet) => {
                      return (
                        <Component
                          data={{
                            title: snippet.title || component.title,
                            icon: snippet.screenshot || component.icon,
                            snippets: [snippet],
                          }}
                          key={`${this.t(group.name)}_${this.t(
                            componentName
                          )}_${this.t(snippet.title)}`}
                        />
                      );
                    });
                })}
              </List>
            </Category>
          );
        })}
      </div>
    );
  }

  renderContent() {
    const { filter = [], keyword } = this.state;
    const hasContent = filter.filter((item) => {
      return item?.categories?.filter((category) => {
        return category?.components?.length;
      }).length;
    }).length;
    if (!hasContent) {
      return this.renderEmptyContent();
    }
    if (keyword) {
      return filter.map((group) => {
        const { categories } = group;
        return this.renderCategorys(group, categories);
      });
    }
    return filter.length > 1 ? (
      <Tab className={cx("tabs")}>
        {filter.map((group) => {
          const { categories } = group;
          return this.renderCategorys(group, categories);
        })}
      </Tab>
    ) : (
      this.renderCategorys("", filter[0].categories)
    );
  }

  render() {
    return (
      <div className={cx("lowcode-component-panel")}>
        {/* <div className={cx("header")}>
          <Search
            className={cx("search")}
            placeholder="搜索组件"
            shape="simple"
            hasClear
            onSearch={this.handleSearch}
            onChange={this.handleSearch}
          />
        </div> */}
        {this.renderContent()}
      </div>
    );
  }
}

export const PaneIcon = IconOfPane;
