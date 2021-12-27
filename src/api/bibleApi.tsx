function onlyNumber(str: string) {
  return str.replace(/[^ㄱ-ㅎ가-힣 ]/g, ' ');
}

function spaceMoreThanOne(str: string) {
  return str.replace(/\s+/g, ' ');
}

export const getHtmlBible = async (book: string, chap: number, sec: number) => {
  const apiUrl = `https://www.bskorea.or.kr/bible/korbibReadpage.php?version=HAN&book=${book}&chap=${chap}&sec=${sec}`;
  const response = await fetch(apiUrl, {
    method: 'get',
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
    },
  });
  let result;
  if (response.status === 200) {
    result = await response.text();
  } else {
    result = '실패';
  }

  const split1 = result.split('&nbsp;&nbsp;&nbsp;</span>');
  const split2 = split1[sec].split('\n');
  const removeNumber = onlyNumber(split2[0]);
  const complete = spaceMoreThanOne(removeNumber);
  console.log(complete);
  return complete;
};

export const a = 'a';
