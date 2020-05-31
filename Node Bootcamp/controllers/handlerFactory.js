const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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