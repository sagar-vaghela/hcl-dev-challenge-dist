const last30SecondStore = (function () {
    const store = {};

    const set = (key, value) =>{
        if (store[key]) {
            if (store[key].length >= 30) {
                store[key].shift();
            }
            store[key].push(value);
        } else {
            store[key] = [value];
        }
    }

    const get = (key) => {
        return key ? store[key] : store;
    }

    return {
        get: get,
        set: set
    }
})();

class HTMLEmulator {
    constructor(container, Sparkline) {
        this.rowsContainer = container.querySelector('.js_rows');
        this.Sparkline = Sparkline;
    }

    _createTableRow(data) {
        let tr = document.createElement('tr');
        tr.setAttribute('name', data.name);

        for (let key in data) {
            let td = document.createElement('td');
            td.innerHTML = data[key];
            tr.appendChild(td);
        }
        tr.appendChild(this._createGraphTD(data));
        return tr;
    }

    _createGraphTD(data) {
        let td = document.createElement('td');
        const sparks = document.createElement('span');
        sparks.setAttribute('class', 'js_spark');
        td.appendChild(sparks);
        return td;
    }

    _saveMidPriceForAll(data) {
        let midPrice = (data.bestBid + data.bestAsk) / 2;
        let store = last30SecondStore.get();
        for (let key in store) {
            last30SecondStore.set(key, store[key][store[key].length - 1]);
        }
        last30SecondStore.set(data.name, midPrice);
    }

    _sortTable(tb, col, reverse) {
        let trs = Array.prototype.slice.call(tb.getElementsByTagName('tr'), 0);
        let i;
        reverse = -((+reverse) || -1);
        trs = trs.sort((a, b)=> reverse * (parseFloat(a.cells[col].textContent) - parseFloat(b.cells[col].textContent)));
        for (i = 0; i < trs.length; ++i) tb.appendChild(trs[i]);
    }


    _addOrUpdateRow(tb, data) {
        let trs = tb.getElementsByTagName('tr');

        let i;
        for (i = 0; i < trs.length; i++) {
            if (trs[i].getAttribute('name') === data.name) {
                break;
            }
        }
        if (i < trs.length) {
            trs[i].remove();
        }
        //add row
        let newRow = this._createTableRow(data);
        tb.appendChild(newRow);
    }

    _drawSparkLines(tb, store) {
        let trs = tb.getElementsByTagName('tr');
        for (let i = 0; i < trs.length; i++) {
            let name = trs[i].getAttribute('name');
            let sparkSpan = trs[i].getElementsByClassName('js_spark')[0];
            this.Sparkline.draw(sparkSpan, store.get(name))
        }
    }

    render(dataRow) {
        this._saveMidPriceForAll(dataRow);

        this._addOrUpdateRow(this.rowsContainer, dataRow);

        this._drawSparkLines(this.rowsContainer, last30SecondStore);

        this._sortTable(this.rowsContainer, 6, 1);
    }
}

module.exports = HTMLEmulator;