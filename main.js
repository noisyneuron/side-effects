import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import data from './data.json';

const loops = getLoops();

function Link( {disease, sideEffect, ...props} ) {
  const item = {
    before: { opacity: 0, y: 0 },
    during: { opacity: 1, y: 0 },
    after: { opacity: 0, y: 0 },
  }

  return (
      <motion.div
        variants={item}
      >
        <p>
          At least 1 drug for treating <br/>
          <span> {disease} </span> <br/>
          lists <br/>
          <span> {sideEffect} </span> <br/>
          as a possible side-effect.
        </p>
      </motion.div>
  );
}



function Path(props) {
  // const [index, setIndex] = useState(374);
  // 374
  const [index, setIndex] = useState(Math.floor(Math.random()*loops.length));
  console.log(index);
  useEffect( () => {
    if(index<loops.length-1) {
      const t = 4000*(loops[index].length);
      setTimeout( ( () => setIndex(index+1) ) , t);
    }
  }, [index]);


  const list = {
    before: {
      opacity: 0,
    },
    during: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 1,
      },
    },
    after: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: .2,
      },
    },
  }

  const loop = loops[index];
  const links = [];
  for(let i=0; i<loop.length-1; i++) {
    links.push(
      <Link animIdx={i*2} disease={loop[i]} sideEffect={loop[i+1]} key={`${index}-${i}`}/>
    );
  }

  return (
    <AnimatePresence >
      [<motion.div
        className="text"
        initial="before"
        animate="during"
        exit="after"
        variants={list}
        key={`loop${index}`}
      >
          {links}
      </motion.div>]
    </AnimatePresence>
  )
}


ReactDOM.render(
  <Path />,
  document.getElementById('root')
);


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

function getLoops() {
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
  return allLoops;
}
