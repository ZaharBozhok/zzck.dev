function getRandomColor(alpha) {
    return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${alpha})`
}

(async function main() {
    let actionsQueue = [];
    const ctx = document.getElementById('myChart').getContext('2d');
    const data = {
        datasets: [],
    };
    const lines = (await (await fetch("/assets/data/roads-puzzle/lines.json")).json()).lines;
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        data.datasets.push({
            data: [{
                x: line.start[0],
                y: line.start[1],
            }, {
                x: line.end[0],
                y: line.end[1],
            }],
            showLine: true,
            radius: 0,
            borderColor: getRandomColor(0.2),
        })
    }
    const scaleOpts = {
        ticks: {
            callback: (val, index, ticks) => index === 0 || index === ticks.length - 1 ? null : val,
        },
        grid: {
            borderColor: 'rgba( 0, 0, 0, 1)',
            color: 'rgba( 0, 0, 0, 0.1)',
        }
    };
    const scales = {
        x: { position: 'bottom' },
        y: { position: 'left' },
    };
    Object.keys(scales).forEach(scale => Object.assign(scales[scale], scaleOpts));
    const myChart = new Chart(ctx, {
        type: 'scatter',
        data: data,
        options: {
            scales: scales,
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy'
                    }
                },
                legend: {
                    display: false
                }
            },
        }
    });

    function getCrossroadsFromLines(lines) {
        let crossroads = {}
        for (let index = 0; index < lines.length; index++) {
            let line = lines[index];
            let points = [line.start, line.end]
            for (let index = 0; index < points.length; index++) {
                const point = points[index];
                if (!(point in crossroads))
                    crossroads[point] = {
                        coordinate: point,
                        lines: new Set([line])
                    }
                else
                    crossroads[point].lines.add(line)
            }
        }
        return crossroads
    }
    const crossroads = getCrossroadsFromLines(lines)
    setTimeout(() => {
        for (const [key, value] of Object.entries(crossroads)) {
            myChart.data.datasets.push({
                data: [{
                    x: value.coordinate[0],
                    y: value.coordinate[1],
                }],
                backgroundColor: 'rgb(255, 99, 132)',
                radius: 3
            })
        }
        myChart.update()
    }, 1000)
})()