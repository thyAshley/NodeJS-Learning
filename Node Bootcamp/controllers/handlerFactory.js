const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => {
    return catchAsync(async (req, res, next) => {
        const document = await Model.findByIdAndDelete(req.params.id)

        if (!document) return next(new AppError('No document found with that ID', 404));
        res.status(204).json({
            status: 'success',
            data: null
        })
    })
}

exports.updateOne = Model => {
    return catchAsync(async (req, res, next) => {
        const id = req.params.id;
        
        const document = await Model.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })
        if (!document) return next(new AppError('No document found with that ID', 404));
        res.status(200).json({
            status: 'success',
            document
        })
    })
}

exports.createOne = Model => {
    return catchAsync(async (req, res, next) => {
        const document = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            document
        })
    })
}

exports.getOne = (Model, popOption) => {
    return catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOption) query = query.populate(popOption);

        const document = await query.select('-password');
        if (!document) return next(new AppError('No Tour found with that ID', 404));
        res.status(200).json({
            status: 'success', 
            data: document
        })
    });
}

exports.getAll = Model => {
    return catchAsync(async (req, res, next) => {
        // execute query
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId }

        const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitField()
        .paginate();
        const document = await features.query;
        // send response
        res.status(200).json(
            {
                status: 'success',
                results: document.length,
                document
            });
    });
}