import { Request, Response } from 'express'

export async function index(req: Request, res: Response) {
    return res.json('E-Shop API');
}