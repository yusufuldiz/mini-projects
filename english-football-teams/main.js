import data from "./data.js";

const generateTeamEls = (team) => {
    return `<tr></tr><td>${team.name}</td><td>${team.championship}</td><td>${team.location}</td>`
};

export const createTableElements = (data, tableId) => {
    const tbody = document.querySelector(`#${tableId} tbody`);
    const resultHtml = data.reduce((acc, team) => {
        return acc+generateTeamEls(team);
    }, "");
    tbody.innerHTML = resultHtml;
};


createTableElements(data, "allcities");
createTableElements(data, "singlecity");