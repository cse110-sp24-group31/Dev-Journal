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
                          height: 100%;
                          max-height: 600px;
                          min-height: 300px;
                          filter: drop-shadow(0px 0px 10px rgb(0, 0, 0, 0.2));
                          padding: 0px 20px;
                          width: 100%;
                          max-width: 400px;
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
    const pb = document.createElement('div');
    pb.classList.add('progress-bar');
    const pbf = document.createElement('div');
    pbf.classList.add('progress-bar-fill');
    pbf.style.width = data.progress + '%';
    pb.appendChild(pbf);
    pbf.innerText = data.progress;

    // Create the actions
    const actions = document.createElement('div');
    actions.classList.add('actions');
    const debugAddProgress = document.createElement('button');
    debugAddProgress.addEventListener('click', () => {
      const pbf = this.shadowRoot.querySelector(
        '.progress-bar > .progress-bar-fill'
      );
      var progress = Number(pbf.innerText);
      if (progress >= 100) {
        progress = 0;
      } else {
        progress = progress + Math.floor(Math.random() * 10);
      }
      pbf.style.width = progress + '%';
      pbf.innerText = progress;
    });
    debugAddProgress.innerText = 'progress + random';
    const open = document.createElement('button');
    open.addEventListener('click', _ => {
      alert('open');
    });
    open.innerText = 'open';
    const options = document.createElement('button');
    options.addEventListener('click', _ => {
      alert('options');
    });

    options.innerText = 'options';

    actions.append(debugAddProgress, open, options);

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
