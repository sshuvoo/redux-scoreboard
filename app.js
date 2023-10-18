//Select dom elemeent
const addMatchButton = document.getElementById('add_match');
const allMatchesContainer = document.getElementById('all-matches-container');
const result = document.getElementById('result');
const resetButton = document.getElementById('reset');

//initial state
const initialState = [{ id: 1, score: 0 }];

// action identifier
const ADDMATCH = 'addmatch';
const DELETEMATCH = 'deletematch';
const INCREMENT = 'increment';
const DECREMENT = 'decrement';
const RESET = 'reset';

//action creator
const addMatchDispatcher = () => {
   return {
      type: ADDMATCH,
   };
};

const deleteMatchDispatcher = (id) => {
   return {
      type: DELETEMATCH,
      id,
   };
};

const incrementDispatcher = (id, value) => {
   return {
      type: INCREMENT,
      payload: {
         id,
         value,
      },
   };
};

const decrementDispatcher = (id, value) => {
   return {
      type: DECREMENT,
      payload: {
         id,
         value,
      },
   };
};

const resetDispatcher = () => {
   return {
      type: RESET,
   };
};

// Reducer fucntion
function scoreReducer(state = initialState, action) {
   if (action.type === ADDMATCH) {
      const copyState = [...state];
      copyState.push({
         id: state.length >= 1 ? state[state.length - 1].id + 1 : 1,
         score: 0,
      });
      return copyState;
   } else if (action.type === DELETEMATCH) {
      return [...state].filter((item) => item.id !== action.id);
   } else if (action.type === INCREMENT) {
      return [...state].map((match) => {
         if (match.id === action.payload.id) {
            return {
               ...match,
               score: Number(match.score) + Number(action.payload.value),
            };
         } else {
            return {
               ...match,
            };
         }
      });
   } else if (action.type === DECREMENT) {
      return [...state].map((match) => {
         if (match.id === action.payload.id) {
            const result = Number(match.score) - Number(action.payload.value);
            return {
               ...match,
               score: result >= 0 ? result : 0,
            };
         } else {
            return {
               ...match,
            };
         }
      });
   } else if (action.type === RESET) {
      return [...state].map((match) => ({ ...match, score: 0 }));
   } else {
      return state;
   }
}

//store
const store = Redux.createStore(scoreReducer);

const render = () => {
   const state = store.getState();
   let matchHTML = '';
   state?.forEach((match) => {
      matchHTML += `<div class="match">
                        <div class="wrapper">
                           <button onclick="deleteHandler(${match.id})" class="lws-delete">
                              <img src="./image/delete.svg" alt="" />
                           </button>
                           <h3 class="lws-matchName">Match ${match.id}</h3>
                        </div>
                        <div class="inc-dec">
                           <form onsubmit="incrementSubmitHandler(event,${match.id})" class="incrementForm">
                              <h4>Increment</h4>
                              <input
                                 type="number"
                                 name="increment"
                                 class="lws-increment"
                              />
                           </form>
                           <form onsubmit="decrementSubmitHandler(event,${match.id})" class="decrementForm">
                              <h4>Decrement</h4>
                              <input
                                 type="number"
                                 name="decrement"
                                 class="lws-decrement"
                              />
                           </form>
                        </div>
                        <div class="numbers">
                           <h2 id="result" class="lws-singleResult">${match.score}</h2>
                        </div>
                     </div>`;
   });
   allMatchesContainer.innerHTML = matchHTML;
};

render();
store.subscribe(render);

//dispatch
addMatchButton.addEventListener('click', () => {
   store.dispatch(addMatchDispatcher());
});

const deleteHandler = (id) => {
   store.dispatch(deleteMatchDispatcher(id));
};

const incrementSubmitHandler = (event, id) => {
   event.preventDefault();
   const payload = event.target.querySelector('input').value;
   store.dispatch(incrementDispatcher(id, payload));
};

const decrementSubmitHandler = (event, id) => {
   event.preventDefault();
   const payload = event.target.querySelector('input').value;
   store.dispatch(decrementDispatcher(id, payload));
};

resetButton.addEventListener('click', () => {
   store.dispatch(resetDispatcher());
});
