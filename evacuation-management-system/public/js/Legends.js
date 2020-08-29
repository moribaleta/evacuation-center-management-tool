class Legends {
    constructor(oGoogle, oMap, oLists, sTitle, id) {
        this.oGoogle = oGoogle;
        this.oMap = oMap;
        this.sTitle = sTitle;
        this.oLists = oLists;
        this.oLegend = document.getElementById(id);
        this.create();
    }

    create() {
        const oDiv = document.createElement('div');
        let sLegends = '';

        this.oLists.forEach(oLegends => {
            const {color, name} = oLegends;
            sLegends += `
                <li><span style="background-color:${color}"></span>${name}</li>
            `;
        });

        oDiv.className = 'd-none';
        oDiv.innerHTML = `
            <div class='legends vertical-legend'>
                <div class='legend-title'>${this.sTitle}</div>
                <div class='legend-scale'>
                    <ul class='legend-labels'>
                        ${sLegends}
                    </ul>
                </div>
            </div>
        `;

        // <div class='legend-source'>Source: <a href="#link to source">Name of source</a></div>

        this.oLegend.appendChild(oDiv);
        this.oMap.controls[this.oGoogle.maps.ControlPosition.TOP_RIGHT].push(this.oLegend);
        setTimeout(() => oDiv.classList.toggle('d-none'), 3000);
    }

}