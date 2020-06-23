import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import data from './data.json';

const loops = getLoops();

function Link( {disease, sideEffect} ) {
  return (
    <p>
      At least 1 drug for treating
      <span> {disease} </span>
      lists
      <span> {sideEffect} </span>
      as a possible side-effect.
    </p>
  );
}



function Path(props) {
  const [index, setIndex] = useState(0);

  const anim = {
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 1,
      },
    },
    hidden: { opacity: 0 }
  }

  const item = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -1000 },
  }

  const loop = loops[index];
  const links = [];
  for(let i=0; i<loop.length-1; i++) {
    links.push(
      <motion.div variants={item} key = { `${index}-${i}` }>
        <Link disease={loop[i]} sideEffect={loop[i+1]} />
      </motion.div>
    );
    links.push(
      <motion.div variants={item} key = { `d${index}-${i}` }>
        <Link disease={loop[i]} sideEffect={loop[i+1]} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="text"
      initial="hidden"
      animate="visible"
      variants={anim}
    >
      {links}
    </motion.div>
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
