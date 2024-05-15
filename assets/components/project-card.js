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
                          max-height: 35px;
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
                        .project-card .progress-bar {
                          width: 100%;
                          background-color: grey;
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
                          height: 100%;
                        }
                        .progress-bar > .progress-bar-fill {
                          width: 12%;
                          height: 100%;
                          background-color: rgb(0, 128, 122);
                          text-align: center;
                          line-height: 30px;
                          color: white;
                        }
                        .progress-bar > .progress-bar-check {
                          width: 100%;
                          height: 100%;
                          background-color: rgb(242, 137, 0);
                          text-align: center;
                          line-height: 30px;
                          color: black;
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
    //TODO: If progress-type is fill, put the fill type in. If progress-type is check, put the check in.
    const pb = document.createElement('div');
    pb.classList.add('progress-bar');
    const pbf = document.createElement('div');
    if (this.json["progress-type"] == "fill"){
      pbf.classList.add('progress-bar-fill');
      pbf.style.width = data.progress + '%';
      pbf.innerText = data.progress;
    } else if (this.json["progress-type"] == "check"){
      console.log(this.json["name"], "is a check.");
      pbf.classList.add('progress-bar-check');
      pbf.innerText = "In Progress";
    }
    pb.appendChild(pbf);

    // Create the actions
    const actions = document.createElement('div');
    actions.classList.add('actions');
    const debugAddProgress = document.createElement('button');
    debugAddProgress.addEventListener('click', () => {
      let pbf;
      if (this.json["progress-type"] == "fill"){
        pbf = this.shadowRoot.querySelector(
          '.progress-bar > .progress-bar-fill'
        );
        //TODO: Progress in json file doesn't change.
        let progress = Number(pbf.innerText);
        progress = progress + Math.floor(Math.random() * 10);
        if (progress >= 100 || pbf.innerText == "Complete!") {
          console.log("Task complete!");
          progress = 100;
          pbf.innerText = "Complete!";
        } else {
          pbf.innerText = progress;
        }
        pbf.style.width = progress + '%';
        
      } else if (this.json["progress-type"] == "check"){
        pbf = this.shadowRoot.querySelector(
          '.progress-bar > .progress-bar-check'
        );

        console.log("Task complete!");

        pbf.style.backgroundColor = "rgb(0, 128, 122)";
        pbf.style.color = "white";
        pbf.innerText = "Complete!";
      }
    });
    debugAddProgress.innerText = 'make progress';
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
        pbf.style.width = 0 + '%';
        
      } else if (this.json["progress-type"] == "check"){
        pbf = this.shadowRoot.querySelector(
          '.progress-bar > .progress-bar-check'
        );

        pbf.style.backgroundColor = "rgb(242, 137, 0)";
        pbf.style.color = "black";
        pbf.innerText = "In Progress";
      }
    });

    // Append action buttons to actions tab
    actions.append(debugAddProgress, open, options, resetProg);

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
