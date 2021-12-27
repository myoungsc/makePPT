/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable promise/always-return */
/* eslint-disable no-console */
const Pptxgen = require('pptxgenjs');
const moment = require('moment');
const { app } = require('electron');

export const b = () => {};

export const makePpt = async (bookInfos: BookInfo[]) => {
  const appPath = app.getPath('desktop');
  const pptx = new Pptxgen();
  pptx.layout = 'LAYOUT_WIDE';

  bookInfos.map(async (value: BookInfo) => {
    const slide = pptx.addSlide();
    // slide.background = { color: 'ffffff' };
    slide.background = { path: './assets/pptxBackground.jpeg' };
    // slide.addImage(
    //   { path: './assets/pptxBackground.jpeg' },
    //   { x: 0, y: 0, w: '50%', h: '100%' }
    // );

    slide.addText(value.chapterText, {
      x: '11%',
      y: '1%',
      w: '89%',
      h: '99%',
      color: '000000',
      valign: 'top',
      fontFace: '맑은 고딕',
      fontSize: 42,
      align: 'left',
      bold: true,
      shadow: {
        type: 'outer',
        color: 'C0C0C0',
        blur: 3,
        offset: 3,
        angle: 45,
      },
    });

    slide.addText(
      `${value.abbreviation}\n${value.selectChapter}:${value.selectSection}`,
      {
        x: '1%',
        y: '1%',
        w: '10%',
        h: '15%',
        color: '333399',
        valign: 'center',
        fontFace: '맑은 고딕',
        fontSize: 24,
        align: 'center',
      }
    );
  });

  const currentDate = moment().format('YYYYMMDD');
  pptx
    .writeFile({ fileName: `${appPath}/${currentDate} 대예배.pptx` })
    .then((fileName: any) => {
      console.log(`created file: ${fileName}`);
    })
    .catch((e: any) => {
      console.log(e);
    });

  return appPath;
};
