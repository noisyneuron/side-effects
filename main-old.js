fetch("data.json")
.then(response => response.json())
.then(data => {

  const orderedIds = Object.keys(data).filter(e => e.length > 0);
  let allLoops = [];
  const div = document.getElementById('text');

  for(const k of orderedIds) {
    const paths = searchAll(k, 6);
    if(paths.length > 0) {
      paths.map( path => allLoops.push(path.map(p => data[p].name)) );
    }
  }
  allLoops = shuffle(allLoops);

  function display(path) {
    let str = "";
    for(let i=0; i<path.length - 1; i++) {
      str += `<p>At least 1 drug for treating <span> ${path[i]} </span> lists <span> ${path[i+1]} </span> as a possible side-effect.</p>`;
    }
    div.innerHTML = str;
  }

  // let i = 0;
  // const showLoop = setInterval( () => {
  //   display(allLoops[i]);
  //   i++;
  //   if(i === allLoops.length) clearInterval(showLoop);
  // }, 5000);



  function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }

  function search(id, depth) {
    let visited = [];
    let queue = [];
    queue.push([id]);

    let d = 0;
    let s = queue.length;
    let i = 0;

    while(i<s && d<depth) {
      let path = queue[0];
      let last = path[path.length-1];
      if(!visited.includes(last)) {
        visited.push(last);
        let effects = data[last].side_effects;
        for(const e of effects) {
          let nPath = path.slice();
          nPath.push(e);
          if(e === id) return nPath;
          queue.push(nPath);
        }
      }
      i++;
      if(i===s) {
        queue = queue.slice(i);
        s = queue.length;
        i=0;
        d++;
      }
    }
    return [];
  }

  function searchAll(id, depth) {
    let allPaths = [];
    let visited = [];
    let queue = [];
    queue.push([id]);

    let d = 0;
    let s = queue.length;
    let i = 0;

    while(i<s && d<depth) {
      let path = queue[0];
      let last = path[path.length-1];
      if(!visited.includes(last)) {
        visited.push(last);
        let effects = data[last].side_effects;
        for(const e of effects) {
          let nPath = path.slice();
          nPath.push(e);
          if(e === id) {
            allPaths.push(nPath)
          } else {
            queue.push(nPath);
          }
        }
      }
      i++;
      if(i===s) {
        queue = queue.slice(i);
        s = queue.length;
        i=0;
        d++;
      }
    }
    return allPaths;
  }


});
