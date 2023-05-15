import {Point} from "./point.js"

/**
 * Create a line object represnting a set of two points in 2D space.
 *
 * Line objects can be constructed by passing in either 4 numbers (startX, startY, endX, endY) - or
 * two {@link Point} objects representing `start` and `end` respectively
 *
 * @class Line
 */
export class Line {
    /**
     * Construct a Line using two {@link Point} objects
     * .
     * @param {Point} start An instance of {@link Point} containing X and Y co-ordinates
     * @param {Point} end   An instance of {@link Point} containing X and Y co-ordinates
     * @memberof Line
     */
    public readonly start: Point;
    public readonly end: Point;
    /**
     * Construct a Line using 4 {@link number}s
     *
     * @param {number} startX Starting position on the X axis
     * @param {number} startY Starting position on the Y axis
     * @param {number} endX   Ending position on the X axis
     * @param {number} endY   Ending position on the Y acis
     * @memberof Line
     */
    constructor (...args:any[]){
        if (args.length === 4) {
            this.start = new Point(args[0],args[1]);
            this.end   = new Point(args[2],args[3]);
            for(let argument_index in args) {
                if(args.hasOwnProperty(argument_index)) {
                    let argument = args[argument_index];
                    if(typeof argument !== 'number'){
                        throw TypeError('When passing 4 arguments, only numbers may be passed');
                    }
                }
            }
        } else if(args.length === 2) {
            [this.start, this.end] = args;
        } else {
            throw Error('Please pass either two Point objects, or 4 integers to the constructor');
        }
    }

    /**
     * Get the line length
     *
     * @returns {number}
     *
     * @memberof Line
     */
    getLength() {
        return Math.sqrt(
            Math.pow(this.start.x - this.end.x, 2) + Math.pow(this.start.y - this.end.y, 2)
        );
    }

    is_invalid() {
        if(Number.isNaN(this.start.x)) return true
        if(Number.isNaN(this.end.x)) return true
        if(Number.isNaN(this.start.y)) return true
        if(Number.isNaN(this.end.y)) return true
        if(this.start.x > Number.MAX_SAFE_INTEGER) return true
        if(this.start.y > Number.MAX_SAFE_INTEGER) return true
        if(this.end.x > Number.MAX_SAFE_INTEGER) return true
        if(this.end.y > Number.MAX_SAFE_INTEGER) return true
        return false
    }
}

/** @ignore */
