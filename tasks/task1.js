function dashatize(n) {
 
  if (isNaN(n)) {
    return NaN;
  }

  if (!Number.isInteger(n)) {
    return '';
  }

  const numStr = Math.abs(n).toString();

  if (numStr === '0') {
    return '0';
  }

  let result = '';

  for (let i = 0; i < numStr.length; i++) {
    const digit = parseInt(numStr[i]);
    const isOdd = digit % 2 !== 0;

    if (isOdd) {
    
      result += `-${digit}-`;
    } else {
      result += digit;
    }
  }

  result = result.replace(/--/g, '-');
  
  if (result.startsWith('-')) {
    result = result.substring(1);
  }
  if (result.endsWith('-')) {
    result = result.slice(0, -1);
  }

  return result;
}

// Тесты
console.log(dashatize(274));    
console.log(dashatize(6815));  
console.log(dashatize(NaN));   
console.log(dashatize(0));      
console.log(dashatize(-1));   
console.log(dashatize(-28369)); 
console.log(dashatize(3.14));   