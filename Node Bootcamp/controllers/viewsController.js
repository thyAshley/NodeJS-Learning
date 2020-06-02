exports.getOverview = (req, res) => {
    res.status(200).render('overview.pug', {
        title: 'All Tours'
    });
}

exports.getTour = (req, res) => {
        res.status(200).render('tour.pug', {
            title: 'The Forest Hiker'
        })
}
