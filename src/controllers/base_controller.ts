import {Request, Response} from "express";
import { Model } from "mongoose";


export class BaseController<T> {
    model: Model<T>;
    constructor(model: Model<T>) {
        this.model = model;
    }

 async create (req: Request, res: Response) {
    try {
        const modelValue = await this.model.create(req.body);
        res.status(201).send(modelValue);
    } catch (error) { res.status(400).send(error); }
}

 async getAll (req: Request, res: Response) {
    const filter = req.query.sender;
    try {
        if (filter) {
            const modelValue = await this.model.find({ sender: filter });
            res.send(modelValue);
        } else {
            const modelValue = await this.model.find();
            res.send(modelValue);
        }

    } catch (error) {
        res.status(400).send(error);
    }
};

 async getById (req: Request, res: Response)  {
    const id = req.params.id;
    if (id) {
        try {
            const modelValue = await this.model.findById(id);
            if (modelValue) {
                return res.send(modelValue);
            } else {
                return res.status(404).send("Value not found");
            }
        } catch (error) {
            return res.status(400).send(error);
        }
    }
    return res.status(404).send("Value not found");
};

 async update (req: Request, res: Response) {
    const id = req.params.id;
    const { content } = req.body;
    if (id) {
        try {
            const modelValue = await this.model.findByIdAndUpdate(
                id,
                { content: content },
                { new: true }
            );
            if (modelValue) {
                return res.status(201).send(modelValue);
            } else {
                return res.status(404).send("Value not found");
            }
        } catch (error) {
            return res.status(400).send(error);
        }
    }
};

 async delete (req: Request, res: Response) {
    const id = req.params.id;
    try {
        const modelValue = await this.model.findByIdAndDelete(id);
        if (modelValue) {
            return res.status(200).send(modelValue);
        } else {
            return res.status(404).send("Value not found");
        }
    } catch (error) {
        return res.status(400).send(error);
    }
};
};

const createController = <T>(model: Model<T>) => {
    return new BaseController(model);
  }
  export default createController;