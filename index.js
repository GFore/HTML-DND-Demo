/*
  Code is from modified from DnD tutorial at:
    https://css-tricks.com/creating-a-parking-game-with-the-html-drag-and-drop-api/

  This tutorial doesn't work as explained in the article due to changes in how
  moment.js works, so I simplified the code to avoid using moment.
*/

// const parkingRules =  {
//   ambulance: {
//     days: [0, 1, 2, 6],
//     fromTime: 0,
//     toTime: 4,
//   },
//   'fire truck': {
//     days:  [0, 1, 2, 3, 4, 5, 6],
//     fromTime: 4,
//     toTime: 12,
//   },
//   car: {
//     days: [0, 1, 2, 3, 4, 5, 6],
//     fromTime: 12,
//     toTime: 18,
//   },
//   bicycle: {
//     days: [0, 1, 2, 3, 4, 5, 6],
//     fromTime: 18,
//     toTime: 23,
//   },
// };

let dragged; // Keeps track of what's being dragged

function onDragStart(event) {
  let target = event.target;
  if (target && target.nodeName === 'IMG') { // If target is an image
    dragged = target;
    event.dataTransfer.setData('text', target.id);
    event.dataTransfer.dropEffect = 'move';
    // Make it half transparent when it's being dragged
    event.target.style.opacity = .3;
  }
  console.log('start event >>> ', event);
}

function onDragEnd(event) {
  console.log('end event >>> ', event);
  if (event.target && event.target.nodeName === 'IMG') {
    event.target.style.opacity = ''; // Reset opacity when dragging ends 
    dragged = null; 
  }
}

function onDragOver(event) {
  event.preventDefault(); // Prevent default to allow drop
}

function onDragLeave(event) {
  event.target.style.background = '';
}

const canPark = (v) => v !== 'car'; // can extend this by comparing current datetime to parkingRules

function onDragEnter(event) {
  const target = event.target;
  if (dragged && target) {
    const vehicleType = dragged.alt; // e.g bicycle, ambulance
    if (canPark(vehicleType)) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      target.style.background = '#1f904e';  // Change color to green to show it can be dropped
     }
    else {
      // Don't call event.preventDefault() here so the browser won't allow a drop by default
      target.style.backgroundColor = '#d51c00';  // Change color to red to show it can't be dropped
    }
  }
}

function onDrop(event) {
  const target = event.target;
  if (target) {
    const vehicleType = dragged.alt;
    target.style.backgroundColor = '';
    if (canPark(vehicleType)) {
      event.preventDefault();
      // Get the id of the target and add the moved element to the target's DOM
      dragged.parentNode.removeChild(dragged);
      dragged.style.opacity = '';
      target.appendChild(dragged);
    }
  }
}

// Adding event listeners for dragging
const vehicles = document.querySelector('.vehicles');
vehicles.addEventListener('dragstart', onDragStart);
vehicles.addEventListener('dragend', onDragEnd);

// Adding event listeners for dropping
const dropZone = document.querySelector('.drop-zone');
dropZone.addEventListener('drop', onDrop);  // Triggered when the draggable item has been released and the drop area agrees to accept the drop
dropZone.addEventListener('dragenter', onDragEnter);  // Triggered at the moment >= 50% of a draggable item enters a drop zone
dropZone.addEventListener('dragleave', onDragLeave);  // Triggered once a draggable item has moved away from a drop zone
dropZone.addEventListener('dragover', onDragOver);  // Triggered with dragenter but it is called repeatedly while the draggable item is within the drop zone