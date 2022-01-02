/* eslint-disable no-await-in-loop */
/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from 'react';
import { getHtmlBible } from '../api/bibleApi';
import { OldList, NewList, BookNames } from '../util/bible';
import './Main.css';

declare global {
  interface Window {
    electron: any;
  }

  interface BookInfo {
    key: string;
    bookName: string;
    chapter: number[];
    sectionForChap: number[];
    selectChapter: number;
    selectSection: number;
    chapterText: string;
    abbreviation: string;
  }
}

const Main = () => {
  const [oldNew, setOldNew] = useState<string[]>([
    '구약성경',
    '신약성경',
    '초기화',
  ]);
  const [selectOldNew, setSelectOldNew] = useState<string[]>();
  const [isSelectOldNew, setIsSelectOldNew] = useState<string>();
  const [isSelect, setIsSelect] = useState<boolean>(false);
  const [selectBookInfo, setSelectBookInfo] = useState<BookInfo>();
  const [sectionList, setSectionList] = useState<number[]>();
  const [chapter, setChapter] = useState<number>();
  const [checkInfo, setCheckInfo] = useState<BookInfo[]>();
  const [bookVersion, setBookVersion] = useState<string>();

  const clickOldNew = (value: string) => {
    setSelectBookInfo(undefined);
    setSectionList(undefined);

    if (value === '초기화') {
      setSelectOldNew(undefined);
      setIsSelectOldNew(undefined);
      setIsSelect(false);
      setCheckInfo(undefined);
      setChapter(undefined);
      setSectionList(undefined);
      setSelectBookInfo(undefined);
      setBookVersion(undefined);
      return;
    }

    if (value === '구약성경') {
      setSelectOldNew(OldList);
      setIsSelectOldNew('구약성경');
    } else {
      setSelectOldNew(NewList);
      setIsSelectOldNew('신약성경');
    }
    setIsSelect(true);
  };

  const clickSlectBook = (bookName: string) => {
    console.log('selectBook', bookName);
    BookNames.map((value: BookInfo) => {
      if (value.bookName === bookName) {
        setSelectBookInfo(value);
        setSectionList(undefined);
      }
    });
  };

  const clickBookVersion = (version: string) => {
    console.log(version);
    setBookVersion(version);
  };

  const clickSlectChapter = (value: number) => {
    if (selectBookInfo) {
      setChapter(value);
      setSectionList(
        Array.from(
          { length: selectBookInfo.sectionForChap[value - 1] },
          (_, i) => i + 1
        )
      );
    }
  };

  const clickSelectSection = (value: number) => {
    let bookInfos: BookInfo[] = [];
    if (checkInfo) {
      bookInfos = [...checkInfo];
    }

    if (selectBookInfo && chapter) {
      const temp: BookInfo = { ...selectBookInfo };
      temp.selectSection = value;
      temp.selectChapter = chapter;
      bookInfos.push(temp);
      setCheckInfo(bookInfos);
    }
  };

  const deleteSelectBookInfo = (index: number) => {
    let bookInfos: BookInfo[] = [];
    if (checkInfo) {
      bookInfos = [...checkInfo];
    }
    delete bookInfos[index];
    const temp = bookInfos.filter((value: BookInfo) => {
      return value !== undefined;
    });
    setCheckInfo(temp);
  };

  const submitMakePpt = async () => {
    console.log(bookVersion);

    if (bookVersion === undefined) {
      alert('개역한글 또는 개역개정을 선택해주세요.');
      return;
    }
    if (checkInfo) {
      for (let i = 0; i < checkInfo.length; i += 1) {
        const bookInfo = checkInfo[i];
        const resultText = await getHtmlBible(
          bookInfo.key,
          bookInfo.selectChapter,
          bookInfo.selectSection,
          bookVersion
        );
        bookInfo.chapterText = resultText.trim();
      }
      window.electron.ipcRenderer.renderMakePpt(checkInfo);
    }
  };

  return (
    <div className="Main">
      <div className="Main-view">
        <div className="BookName">
          <div>
            <div className="Main-oldNewView">
              {oldNew.map((value: string) => {
                return (
                  <div
                    key={value}
                    onClick={() => clickOldNew(value)}
                    onKeyUp={() => {}}
                    className={
                      isSelectOldNew === value
                        ? 'Main-button-Select'
                        : 'Main-button'
                    }
                  >
                    <label className="Main-button-label">{value}</label>
                  </div>
                );
              })}
              <div
                onClick={() => clickBookVersion('HAN')}
                onKeyUp={() => {}}
                className={
                  bookVersion === 'HAN' ? 'Main-button-Select' : 'Main-button'
                }
              >
                <label className="Main-button-label">개역한글</label>
              </div>
              <div
                onClick={() => clickBookVersion('GAE')}
                onKeyUp={() => {}}
                className={
                  bookVersion === 'GAE' ? 'Main-button-Select' : 'Main-button'
                }
              >
                <label className="Main-button-label">개역개정</label>
              </div>
            </div>
            <div className="Line-horizontal" />
          </div>
          <div className="Main-selectView-Parents">
            <div className="Main-selectView">
              {isSelect && selectOldNew
                ? selectOldNew.map((value: string) => {
                    return (
                      <div
                        onClick={() => clickSlectBook(value)}
                        onKeyUp={() => {}}
                        className={
                          selectBookInfo?.bookName === value
                            ? 'Main-button-Select'
                            : 'Main-button'
                        }
                        key={value}
                      >
                        <label className="Main-button-label">{value}</label>
                      </div>
                    );
                  })
                : null}
            </div>
            <div className="Main-selectView-right">
              <div className="Line-view ">
                <div className="Line-vertical" />
                <div className="Main-selectView-chapter">
                  {selectBookInfo
                    ? selectBookInfo.chapter.map((value: number) => {
                        return (
                          <div
                            onClick={() => clickSlectChapter(value)}
                            onKeyUp={() => {}}
                            className="Main-button"
                            key={value}
                          >
                            <label className="Main-button-label">{value}</label>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
              {selectBookInfo ? <div className="Line-horizontal" /> : null}
              <div className="Line-view ">
                <div className="Line-vertical" />
                <div className="Main-selectView-section">
                  {sectionList
                    ? sectionList.map((value: number) => {
                        return (
                          <div
                            onClick={() => clickSelectSection(value)}
                            onKeyUp={() => {}}
                            className="Main-button"
                            key={value}
                          >
                            <label className="Main-button-label">{value}</label>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
              {sectionList ? <div className="Line-horizontal" /> : null}
            </div>
          </div>
        </div>
        <div className="Line-vertical" />
        <div className="SelectBible">
          <label className="SelectBible-Title">선택한 성경</label>
          {checkInfo &&
            checkInfo.map((value: BookInfo, index: number) => {
              return (
                <div className="SelectBible-ListView" key={value.key + index}>
                  <div
                    onClick={() => deleteSelectBookInfo(index)}
                    onKeyUp={() => {}}
                    className="SelectBible-ListDeleteView"
                  >
                    <label className="SelectBible-ListDeleteLabel">삭제</label>
                  </div>
                  <label className="SelectBible-ListLabel">{`${value.bookName} ${value.selectChapter}:${value.selectSection}`}</label>
                </div>
              );
            })}
          <div
            className="SelectBible-makePPTView"
            onClick={submitMakePpt}
            onKeyUp={() => {}}
          >
            <label className="SelectBible-makePPTLabel">ppt 만들기</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
