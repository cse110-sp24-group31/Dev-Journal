/**
 * project-card element
 */
class ProjectCard extends HTMLElement {
  constructor() {
    super(); // inherets everything from HTMLElement
    this.attachShadow({ mode: 'open' }); // Creates the Shadow DOM
  }

  set data(data) {
    this.json = data; // Store the data passed in for later
    this.progress = data.progress; // NOTE: progres should be dynamically calculated but for testing just give a number

    // Store the element styles in a <style> block, needed bc of the shadow DOM
    const styles = document.createElement('style');
    styles.innerHTML = `.project-card {
                          align-items: center;
                          background-color: rgba(255, 255, 255, 0.712);
                          border-radius: 5px;
                          display: grid;
                          grid-template-areas:
                            'name'
                            'project-image'
                            'desc'
                            'progress-bar'
                            'actions';
                          grid-template-rows: 10% 40% 35% 5% 10%;
                          height: 600px;
                          min-height: 300px;
                          filter: drop-shadow(0px 0px 10px rgb(0, 0, 0, 0.2));
                          padding: 0px 20px;
                          width: 360px;
                          min-width: 200px;
                        }
                        .project-card .name {
                          color: rgb(0, 0, 0);
                          font-size: 1.8em;
                          font-weight: bold;
                          margin: 0;
                          transition: 0.1s ease all;
                        }

                        .project-card .name:hover {
                          font-size: 2em;
                          margin: 0;
                          white-space: wrap;
                          overflow: auto;
                          text-overflow: unset;
                          transition: 0.1s ease all;
                        }

                        .project-card button {
                          background-color: rgb(255, 208, 0);
                          border: none;
                          border-radius: 5px;
                          color: black;
                          justify-self: center;
                          max-height: 45px;
                          padding: 8px 20px;
                          transition: 0.1s ease all;
                        }

                        .project-card button:hover {
                          background-color: rgb(255, 166, 0);
                          cursor: pointer;
                          transition: 0.1s ease all;
                        }

                        .project-card .project-image {
                          align-self: center;
                          justify-self: center;
                          object-fit: fill;
                          height: 100%;
                          width: 100%;
                        }
                        .project-card .progress-bar{
                          width: 100%;
                          background-image: url('assets/images/SpaceBackground_Pixelart.png');
                          background-size: 100% 100%;
                          background-position: center;
                          background-repeat: no-repeat;
                          box-sizing: border-box;
                          position: relative;
                          overflow: hidden;
                        }
                        
                        .project-card .progress-bar::before {
                          content: '';
                          position: absolute;
                          width: 100%;
                          height: 100%;
                          background-color: rgba(0, 0, 0, 0);
                          transition: background-color 0.1s ease;
                          z-index: 1;
                        }
                        .project-card .progress-bar:hover::before {
                          background-color: rgba(0, 0, 0, 0.2);
                          cursor: pointer;
                          transition: background-color 0.1s ease, color 0.1s ease;
                        }
                        .project-card .progress-bar.selected:hover {
                          transition: background-color 0.1s ease, color 0.1s ease, width 0.1s ease;
                        }
                        .project-card .progress-bar:hover > .progress-bar-check.complete::before{
                          background-color: rgba(0, 0, 0, 0);
                          cursor: default;
                        }
                        .project-card .progress-bar:hover > .progress-bar-check::before {
                          background-color: rgba(0, 0, 0, 0.2);
                          cursor: pointer;
                          transition: 0.1s ease all;
                        }

                        .project-card .desc {
                          width: 90%;
                          height: 80%;
                          align-self: center;
                          overflow: auto;
                          text-align: left;
                          padding-top: 5%;
                          padding-left: 5%;
                          padding-right: 5%;
                          text-anchor: middle;
                          border-radius: 5% 5% 5% 5%;
                          background-color: rgba(0, 0, 0, 0.164);
                        }
                        .progress-bar {
                          height: 45px;
                        }
                        .progress-bar > .progress-bar-fill {
                          position: absolute;
                          width: 100%;
                          height: 100%;
                          background-image: url('assets/images/FireBackground_Pixelart.png');
                          background-size: 100% 100%;
                          background-position: center;
                          background-repeat: no-repeat;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          line-height: 30px;
                          color: black;
                          transition: background-color 0.1s ease, color 0.1s ease;
                        }
                        .progress-bar > .cursor {
                          position: absolute;
                          height: 100%;
                          width: 18%;
                          background-image: url('assets/images/Spaceship_Pixelart.png');
                          background-size: 100% 100%;
                          background-position: center;
                          background-repeat: no-repeat;
                          pointer-events: none;
                          z-index: 1;
                        }
                        .progress-bar.selected {
                          border: 2px solid blue;
                        }
                        .progress-bar > .progress-bar-check {
                          width: 100%;
                          height: 100%;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          line-height: 30px;
                          background-image: url('https://images.pexels.com/photos/53594/blue-clouds-day-fluffy-53594.jpeg');
                          background-size: 100% 100%;
                          background-position: center;
                          background-repeat: no-repeat;
                          justify-self: center;
                          position: relative;
                          z-index: 2;
                          overflow: hidden;
                          color: black;
                        }
                        .progress-bar > .progress-bar-check::before {
                          content: '';
                          position: absolute;
                          width: 100%;
                          height: 100%;
                          background-color: rgba(0, 0, 0, 0);
                          transition: background-color 0.1s ease;
                          z-index: 1;
                        }
                        .progress-bar-check.complete {
                          background-image: url('https://i.pinimg.com/originals/a3/33/ae/a333aed62873505b21ffbaf54efd9c0d.jpg');
                          background-color: rgb(0, 128, 122);
                          color: white;
                        }
    `;

    // Create the outer wrapper for the project card to nest inside
    const wrapper = document.createElement('div');
    wrapper.classList.add('project-card');

    // Create the prject card name
    const title = document.createElement('p');
    title.classList.add('name');
    title.innerHTML = data.name;

    // Create the project card image element
    const img = document.createElement('img');
    img.setAttribute('src', data.image);
    img.setAttribute('alt', data.name);
    img.classList.add('project-image');

    // Create the description
    const desc = document.createElement('div');
    desc.classList.add('desc');
    desc.innerText = data.desc;

    //create progress bar
    //If progress-type is fill, put the fill type in. If progress-type is check, put the check in.
    const progressType = this.json["progress-type"];
    const pb = document.createElement('div');
    pb.classList.add('progress-bar');
    const pbf = document.createElement('div');
    if (progressType == "fill"){
      pbf.classList.add('progress-bar-fill');
      pbf.style.right = 100-data.progress + '%';
      pbf.innerText = data.progress;

      var pbfCursor = document.createElement('div');
      pbfCursor.classList.add('cursor');
      console.log(pbfCursor.offsetWidth);
      pbfCursor.style.left = (data.progress-pbfCursor.offsetWidth/2) + '%';
      pb.append(pbfCursor);
      console.log(pbfCursor.offsetWidth);
    } else if (progressType == "check"){
      pbf.classList.add('progress-bar-check');
      pbf.innerText = "In Progress";
    }
    pb.appendChild(pbf);

    pb.addEventListener('click', (event) => {
      event.stopPropagation();    //Prevents document.addEventListener('click') from activating.

      let pbf;
      if(progressType == "fill"){
        pbf = this.shadowRoot.querySelector(
          '.progress-bar'
        );

        pbf.classList.toggle('selected');   //Change to add, then put remove in the (mouseup) thing
        console.log('Progress bar (fill) clicked!');
      } else {
        console.log('Progress bar (check) clicked!');
        pbf = this.shadowRoot.querySelector(
          '.progress-bar > .progress-bar-check'
        );

        pbf.classList.add('complete');
        pbf.innerText = "Complete!";
      }
    });

    document.addEventListener('click', () => {
      const projCards = document.querySelectorAll('project-card');

      projCards.forEach(card => {
          const selectedBar = card.shadowRoot.querySelector('.progress-bar.selected');
          if (selectedBar){
              selectedBar.classList.remove('selected');
          }
      });
    });

    let fillUpdating = false;
    pb.addEventListener('mousedown', (event) => {   //TODO: Find way to make
      event.preventDefault();

      if(progressType == "fill"){
        if(pb.classList.contains('selected')){
          fillUpdating = true;
          updateFill(event.offsetX);
        }
      }
    });

    let animationFrameId;

    document.addEventListener('mousemove', (event) => {
      if (fillUpdating){
        const pbRect = pb.getBoundingClientRect();
        const offsetX = event.screenX - pbRect.left;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => updateFill(offsetX));
      }
    });

    function updateFill(offsetX){
      let progBarDist = pb.style.right;

      let distPercent = (offsetX / pb.offsetWidth) * 100 + progBarDist;

      distPercent = Math.max(0, Math.min(100, distPercent));

      pbf.style.right = 100-distPercent + '%';
      pbf.innerText = Math.round(distPercent);

      updateCursor((distPercent / 100) * pb.offsetWidth)
    }

    function updateCursor(cursorPosition){
      pbfCursor.style.left = (cursorPosition-pbfCursor.offsetWidth/2) + 'px';
    }

    document.addEventListener('mouseup', () => {
      if(fillUpdating){
        fillUpdating = false;
        this.json["progress"] = Number(pbf.innerText);
      }
    });

    // Create the actions
    const actions = document.createElement('div');
    actions.classList.add('actions');
    const open = document.createElement('button');
    open.innerText = 'open';
    open.addEventListener('click', e => showModal_projectCard(e, open, data));
    const options = document.createElement('button');
    options.innerText = 'options';
    options.addEventListener('click', _ => {
      alert('options');
    });
    const resetProg = document.createElement('button');
    resetProg.innerText = 'reset';
    resetProg.addEventListener('click', _ => {
      let pbf;
      if (this.json["progress-type"] == "fill"){
        pbf = this.shadowRoot.querySelector(
          '.progress-bar > .progress-bar-fill'
        );
        
        pbf.innerText = "0";
        pbf.style.right = 0 + '%';
        pbfCursor.style.left = (-pbfCursor.offsetWidth/2) + 'px';;
        
      } else if (this.json["progress-type"] == "check"){
        pbf = this.shadowRoot.querySelector(
          '.progress-bar > .progress-bar-check'
        );

        pbf.classList.remove('complete');
        pbf.innerText = "In Progress";
      }
    });

    // Append action buttons to actions tab
    // EDIT: Removed debugAddProgress, I want to move out of debug because we only have like 2-3 weeks left ARGH
    actions.append(open, options, resetProg);

    // Add all of the above elements to the wrapper
    wrapper.append(title, img, desc, pb, actions);

    // Append the wrapper and the styles to the Shadow DOM
    this.shadowRoot.append(styles, wrapper);
  }

  get data() {
    return this.json;
  }
}

customElements.define('project-card', ProjectCard);

// Function to show the modal
function showModal_projectCard(e, btn, data) {
  e.preventDefault();
  console.log(btn);
  const modal = document.getElementById('projectView');
  const modalContent = modal.querySelector('.modal-content p');
  modalContent.textContent = 'Content for ' + data.desc; // Set the content dynamically
  modal.style.display = 'block'; // Show the modal
}
