import * as React from 'react';
import {
  Rect,
  Text,
} from '../../renderer';
import { measureTextWidth } from '@antv/util';

function isWordSplitterChar(char: string, index: number, str: string, wordSplitter: any) {
  const isRegExp = Object.prototype.toString.call(wordSplitter) === '[object RegExp]';

  // 自定义单词分割器，正则模式
  if (isRegExp) {
    return wordSplitter.test(char);
  }

  // 自定义单词分割器，函数模式
  if (typeof wordSplitter === 'function') {
    return wordSplitter(char, index, str);
  }

  // 默认的单词分割器是非字母、数字、下划线
  return /[^\w]/.test(char);
}

function split2Word(str: string, wordSplitter?: any) {
  const len = str.length;
  const words = [];
  let word = '';

  for (let i = 0; i < len; i++) {
    const char = str.charAt(i);

    if (isWordSplitterChar(char, i, str, wordSplitter)) {
      if (word) {
        words.push(word);
        word = '';
      }

      words.push(char);
    } else {
      word += char;
    }
  }

  if (word) {
    words.push(word);
  }

  return words;
}

function calcWordWidth(word: string, fontSize: number) {
  const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
  let width = 0;
  const letters = word.split('');

  for (let i = 0, len = letters.length; i < len; i++) {
    const letter = letters[i];

    if (pattern.test(letter)) {
      // Chinese charactors
      width += fontSize;
    } else {
      // get the width of single letter according to the fontSize
      width += measureTextWidth(letter, fontSize);
    }
  }

  return width;
}

/**
 * format the string
 * @param {string} str The origin string
 * @param {number} maxWidth max width
 * @param {number} fontSize font size
 * @param {boolean} keepWord word break
 * @return {string} the processed result
 */
const fittingString = (str: string, maxWidth: number, fontSize: number, keepWord?: boolean, wordSplitter?: any) => {
  let currentWidth = 0;
  let sentence = '';
  const sentences = [];
  const words = keepWord ? split2Word(str, wordSplitter) : str.split('');

  for (let i = 0, len = words.length; i < len; i++) {
    const word = words[i];
    const wordWidth = calcWordWidth(word, fontSize);

    if (currentWidth + wordWidth > maxWidth) {
      sentences.push(sentence);
      currentWidth = 0;
      sentence = '';
    }

    currentWidth += wordWidth;
    sentence += word;
  }

  if (sentence) {
    sentences.push(sentence);
  }

  return sentences;
};

interface TextareaProps {
  text?: string,
  placeholder?: string,
  wordBreak?: boolean,
  wordSplitter?: any,
  style?: any,
  wrapperStyle?: any,
  maxLineCount?: number,
  name: string
}

const Textarea: React.FC<TextareaProps> = (props) => {
  const {
    text = '',
    placeholder = '',
    wordBreak = false,
    wordSplitter,
    style = {},
    wrapperStyle = {},
    maxLineCount,
    name
  } = props;
  const fontSize = style.fontSize || 14;
  const lineHeight = style.lineHeight || fontSize * 1.2;
  const height = style.height || lineHeight;
  const maxWidth = style.maxWidth || wrapperStyle.maxWidth || 200;
  const textLines = fittingString(text || placeholder, maxWidth, fontSize, !wordBreak, wordSplitter);
  if (!maxLineCount) {
    return (
      <Rect name={name} style={{ ...wrapperStyle }}>
        {
          textLines.map((txt, index) => {
            return (
              <Text
                name={`${name}${index}`}
                style={{
                  ...style,
                  lineHeight,
                  height,
                }}
              >
                {txt}
              </Text>
            );
          })
        }
      </Rect>
    );
  } else {
    // 正常渲染前maxLine行
    const normalTextLines = textLines.splice(0, maxLineCount - 1);
    // maxLine后拼接成一行省略渲染
    const ellipsisTextLine = textLines.join();
    return (
      <Rect name={name} style={{ ...wrapperStyle }}>
        {
          normalTextLines.map((txt, index) => {
            return (
              <Text
                name={`${name}${index}`}
                style={{
                  ...style,
                  lineHeight,
                  height,
                }}
              >
                {txt}
              </Text>
            );
          })
        }
        {
          ellipsisTextLine !== '' && (
            <Text name={`${name}${maxLineCount - 1}`} style={{
              ...style,
              maxWidth: maxWidth - 2 * fontSize,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}>{ellipsisTextLine}</Text>
          )
        }
      </Rect>
    );
  }
};

export default Textarea;
