const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const height = e.target.querySelector('#domoheight').value;

    if(!name || ! age){
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, height}, onDomoAdded);
    return false;
}

const AlterDomo = (e, onDomoChange) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoNameChange').value;
    const newAge = e.target.querySelector('#ageChange').value;
    const newHeight = e.target.querySelector('#domoHeightChange').value;
    

    if(!name){
        helper.handleError('Please put in a name');
        return false;
    }

    if(!newAge && !newHeight){
        helper.handleError('Please put in an age or height to change!');
        return false;
    }

    console.log(name, newAge, newHeight);
    helper.sendPost(e.target.action, {name, newAge, newHeight}, onDomoChange);
    return false;
}

const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit={(e)=> handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id='domoName' type='text' name='name' placeholder='Domo Name'/>
            <label htmlFor='age'>Age: </label>
            <input id='domoAge' type='number' min="0" name='age' />
            <label htmlFor='height'>Height: </label>
            <input id='domoHeight' type='number' min="0" name='height' />
            <input className='makeDomoSubmit' type='submit' value="Make Domo" />
        </form>
    );
}

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    //if there is nothing inside the data returns this
    if(domos.length === 0){
        return(
            <div className="domoList">
                <h3 className='emptyDomo'>No Domos Yet!</h3>
            </div>
        );
    }


    //returns this if there is data
    const domoNodes = domos.map(domo => {
        return(
            <div key={domo.id} className='domo'>
                <img src="/assets/img/domoface.jpeg" alt="domo face" className='domoFace' />
                <h3 className='domoName'>Name: {domo.name}</h3>
                <h3 className='domoAge'>Age: {domo.age}</h3>
                <h3 className='domoHeight'>Height: {domo.height}</h3>
            </div>
        );
    });

    return(
        <div className='domoList'>
            {domoNodes}
        </div>
    );
}

const ChangeDomo = (props) => {
    return(
        <form id="domoChange"
            onSubmit={(e)=> AlterDomo(e, props.triggerReload)}
            name="domoChange"
            action="/changeDomo"
            method="POST"
            className="domoChange"
        >
            <h3 className='nameChange'>Name: </h3>
            <input id='domoNameChange' type='text' name='name' placeholder='Domo You want to Change'/>
            <label htmlFor='ageChange'>Age: </label>
            <input id='ageChange' type='number' min="0" name='ageChange' />
            <label htmlFor='domoHeightChange'>Height: </label>
            <input id='domoHeightChange' type='number' min="0" name='domoHeightChange' />
            <input className='makeDomoSubmit' type='submit' value="Change Domo" />
        </form>
            
    );
}

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return(
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
            <div id='domoChange'>
                <ChangeDomo triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
        </div>
    );
};

const init = () =>{
    const root = createRoot(document.getElementById('app'));
    root.render( <App />);
};

window.onload = init;