const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');


const handleGunpla = (e, onGunplaAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#gunplaName').value;
    const grade = e.target.querySelector('#gunplaGrade').value;
    const price = e.target.querySelector('#gunplaPrice').value;

    if(!name || !grade || !price){
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name, grade, price}, onGunplaAdded);
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

const FinishCheckBox = (props) => {

    const modelID = props.gunpla[0]._id;

    const [isChecked, checkHandler] = useState(() => {
        const saved = localStorage.getItem(modelID);
        return saved !== null ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem(modelID, JSON.stringify(isChecked));
    }, [isChecked]);

    const changeState = (e) => {
        checkHandler(!isChecked);
        const name = props.gunpla[0].name;
        const grade = props.gunpla[0].grade;
        const built = !isChecked;



        helper.sendPost('/finished', {name, grade, built}, props.props[0].reloadGunplas);
    }

    return(
            <input 
            type='checkbox' 
            id='built' 
            action='/finished'
            checked={isChecked} 
            onChange={() => changeState()} 
            name='built' value='Built' />
    );
}


const GunplaForm = (props) => {
    return(
        <form id="gunplaForm"
            onSubmit={(e)=> handleGunpla(e, props.triggerReload)}
            name="gunplaForm"
            action="/maker"
            method="POST"
            className="gunplaForm"
        >
            <label htmlFor="name">Name: </label>
            <input id='gunplaName' type='text' name='name' placeholder='Gunpla Model'/>
            <label htmlFor='grade'>Grade: </label>
            <select name="grade" id="gunplaGrade">
                <option value="HG">HG</option>
                <option value="RG">RG</option>
                <option value="MG">MG</option>
                <option value="PG">PG</option>
            </select>
            <label htmlFor='price'>Price: </label>
            <input id='gunplaPrice' type='number' min="0" name='height' />
            <input className='makeGunplaSubmit' type='submit' checked='false' value="Add Gunpla" />
        </form>
    );
}

const FilteredForm = (props) => {
    return(
        <form id='filterForm'
        name='filterForm'
        action='/filtered'
        onSubmit={(e) => FilterGunpla(e, props)}
        className='filterForm'>
            <label htmlFor='searchSelector'>Filter by: </label>
            <select name='grade' id='grade'>
                <option value="HG">HG</option>
                <option value="RG">RG</option>
                <option value="MG">MG</option>
                <option value="PG">PG</option>
            </select>
            <input className='makeGunplaSubmit' type='submit' value="Filter" />
        </form>
    );
}

const FilterGunpla = (e, props) =>{
    e.preventDefault();
    helper.hideError();

    const [gunplas, setGunplas] = useState([]);
    const filterOption = e.target.querySelector('.filterForm').getElementById('grade').value;

    useEffect(() => {
        const loadGunplasFromServer = async() => {
            const response = await fetch(`${e.target.action}?grade=${filterOption}`)
            const data = await response.json();
            setGunplas(data.gunplas);
        };
        loadGunplasFromServer();
    }, [props.reloadGunplas]);

        if(gunplas.length === 0){
        return(
            <div className="gunplaList">
                <h3 className='emptyGunpla'>No Models in this Grade!</h3>
            </div>
        );
    }

    //returns this if there is data
    const gunplaNodes = gunplas.map(gunpla => {

        //loads the images
        let src = "/assets/img";
        {
            if(gunpla.grade === 'HG'){
                src += "/highgrade.png"
            }
            if(gunpla.grade === 'RG'){
                src += "/realgrade.png"
            }
            if(gunpla.grade === 'MG'){
                src += "/mastergrade.png"
            }
            if(gunpla.grade === 'PG'){
                src += "/perfectgrade.png"
            }
        }
       

        return(
            <div key={gunpla.id} className='gunpla'>
                <img src={src} alt="grade " className='gradePic' />
                <h3 className='gunplaName'>Name: {gunpla.name}</h3>
                <h3 className='gunplaGrade'>Grade: {gunpla.grade}</h3>
                <h3 className='gunplaPrice'>Price: {gunpla.price}</h3>
                <label for='built' className='gunplaBuilt'>Finished Building</label>
                <input type='checkbox' id='built' name='built' value='Built' />
            </div>
        );
    });


    return(
        <div className='gunplaList'>
            {gunplaNodes}
        </div>
    );
}

const GunplaList = (props) => {
    const [gunplas, setGunplas] = useState(props.gunplas);

    useEffect(() => {
        const loadGunplasFromServer = async () => {
            const response = await fetch('/getGunplas');
            const data = await response.json();
            setGunplas(data.gunplas);
        };
        loadGunplasFromServer();
    }, [props.reloadGunplas]);

    //if there is nothing inside the data returns this
    if(gunplas.length === 0){
        return(
            <div className="gunplaList">
                <h3 className='emptyGunpla'>No Models Yet!</h3>
            </div>
        );
    }


    //returns this if there is data
    const gunplaNodes = gunplas.map(gunpla => {

        let src = "/assets/img";
        if(gunpla.grade === 'HG'){
            src += "/highgrade.png"
        }
         if(gunpla.grade === 'RG'){
            src += "/realgrade.png"
        }
         if(gunpla.grade === 'MG'){
            src += "/mastergrade.png"
        }
         if(gunpla.grade === 'PG'){
            src += "/perfectgrade.png"
        }

        const id = gunpla.id

        return(
            <div key={gunpla.id} className='gunpla' id={id}>
                <img src={src} alt="grade " className='gradePic' />
                <h3 className='gunplaName'>Name: {gunpla.name}</h3>
                <h3 className='gunplaGrade'>Grade: {gunpla.grade}</h3>
                <h3 className='gunplaPrice'>Price: {gunpla.price}</h3>
                <label for='built' className='gunplaBuilt'>Finished Building</label>
                <FinishCheckBox gunpla={[gunpla]} props={[props]} id={[document.querySelector('id')]} />
            </div>
        );
    });

    return(
        <div className='gunplaList'>
            {gunplaNodes}
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
    const [reloadGunplas, setReloadGunplas] = useState(false);
    const [filterGunplasList, SetForm] = useState(<GunplaList gunplas={[]} reloadGunplas={reloadGunplas}/>);

    const changeGunplaList = (e) => {
        SetForm(<FilterGunpla gunplas={[]} reloadGunplas={reloadGunplas} />)
    }


    const finalRenderPage = 
        <div>
            <div id="makeGunpla">
                <GunplaForm triggerReload={() => setReloadGunplas(!reloadGunplas)} />
            </div>
            <div id="filterModels" >
                <FilteredForm gunplas={[]} reloadGunplas={reloadGunplas} />
            </div>
            {/* <div id="gunplas">
                <GunplaList gunplas={[]} reloadGunplas={reloadGunplas} />
            </div> */}
            <div id="gunplas">
                {filterGunplasList}
            </div>
        </div>;



    return(finalRenderPage);
};

const init = () =>{
    const root = createRoot(document.getElementById('app'));
    root.render( <App />);
};

window.onload = init;