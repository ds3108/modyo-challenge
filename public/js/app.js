/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */

/**
 * Allows to scroll to an element from thw nav bar ( without jQuery)
 * @param {string} id - The id of the element.
 */
const scrollToForm = (id) => {
  document.querySelector(`#${id}`).scrollIntoView({ behavior: 'smooth' });
};

/**
 * Constant that's allowing to iterate with a number of users.
 */
const usersList = [1, 2, 3, 4];

/**
 * Add a listener to an element that match with the responsive navigation bar!
 */
const initNavBar = () => {
  const mainNav = document.getElementById('js-menu');
  const navBarToggle = document.getElementById('js-nav-bar-toggle');

  navBarToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
  });
};

/**
 * Function that return a Promise with the API Call.
 * @param {string} userId - The id of the user. Allow to differentiate it  from others
 */
const call = (userId) => {
  const usersCall = `https://jsonplaceholder.typicode.com/users?id=${userId}`;
  const postsCall = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;

  return new Promise(((resolve, reject) => {
    axios.all([axios.get(usersCall), axios.get(postsCall)]).then((values) => {
      const { data: users } = values[0];
      const { data: posts } = values[1];
      const { name: userName, id } = users[0];
      const { title } = posts[0];
      const desc = posts[0].body;
      return ({ id, userName, comment: { title, desc } });
    }).then((page) => {
      resolve(page);
    }).catch(reject);
  }));
};
/**
 * Function that render the neccesary elements for the carousel. Is an async function
 * because calls the API for each user.
 */
const render = async () => {
  try {
    const testimonials = [];
    for (const userId of usersList) {
      const data = await call(userId);
      testimonials.push(data);
    }

    testimonials.forEach((x) => {
      const target = document.querySelector('.glide__slides');
      const template = `<li class="glide__slide"> 
            <img class="img-testimonials"
             src="img/person_${x.id}.jpg">
             <div class="testimonials-info">
             <p class="testimonials-title">"${x.comment.title}"</p>
             <p class="testimonials-desc">${x.comment.desc}</p>
             <p class="testimonials-author">${x.userName}</p>
             </div>
             </li>`;
      target.insertAdjacentHTML('beforeend', template);
    });
  } catch (ex) {
    // Here should be a logger like NewRelic or Application Insights to track the error.
    // As we don't have any of those, we put a console.log.
    console.error('Error retriving data:', ex);
  } finally {
    // Once the data is retrivied, we init the Glide Carousel.
    new Glide('.glide', {
      type: 'carousel',
      perView: 1,
      autoplay: 5000,
      hoverpause: false,
      focusAt: 'center',
    }).mount();
  }
};

// This function allow to execute the Javascript when the DOM is Ready.
window.onload = () => {
  initNavBar();
  render();
};
