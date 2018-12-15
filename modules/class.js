
/**
 * Modoule Dependencies
 */

const _             = require("underscore");
const winston       = require("winston");
const mongoRequests = require("../dbQueries/mongoRequests");
const Helper        = require("../modules/helper");
const FlightHelper  = require("../modules/flightHelper");
const successTexts  = require("../texts/successTexts");
const errorTexts    = require("../texts/errorTexts");
const ObjectID      = require('mongodb').ObjectID;

const classInfo = {

    /**
     *
     * @param req
     * @returns {Promise<any>}
     */
    create: req => {

        const possibleFields = {
            className: {
                name: "Class Name",
                type: "text",
                minLength: 1,
                maxLength: 6,
                required: true
            },
            travelType: {
                name: "Travel Type",
                type: "text",
                format: "latin",
                minLength: 3,
                maxLength: 64,
                required: true
            },
            classType: {
                name: "Class Type",
                type: "text",
                format: "latin",
                minLength: 3,
                maxLength: 64,
                required: true
            },
            numberOfSeats: {
                name: "Number Of Seats",
                type: "number",
                minLength: 1,
                maxLength: 4,
                required: true
            },
            fareRules: {
                name: "Fare Rules",
                type: "text",
                minLength: 1,
                maxLength: 2048,
                required: true
            },
            fareAdult: {
                name: "Fare ADULT",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            fareChd: {
                name: "Fare CHD",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            fareInf: {
                name: "Fare INF",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            taxAdult: {
                name: "Tax ADULT",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            taxChd: {
                name: "Tax CHD",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            cat: {
                name: "CAT",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            surchargeMultiDestination: {
                name: "Surcharge MULTIDEST",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            surchargeLongRange: {
                name: "Surcharge LONG RANGE",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            surchargeShortRange: {
                name: "Surcharge SHORT RANGE",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            commAdult: {
                name: "Comm ADULT",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            commChd: {
                name: "Comm CHD",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            chargeFeeAdult: {
                name: "Change Fee ADULT",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            chargeFeeChild: {
                name: "Change Fee CHD",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            chargeFeeInfant: {
                name: "Change Fee INF",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            }
        };

        let data = {
            body: req.body,
            userInfo: req.userInfo,
            editableFields: possibleFields,
            editableFieldsValues: req.body,
            flightId: req.params.flightId.toString(),
        };

        return new Promise((resolve, reject) => {
            if ("Admin" !== data.userInfo.role) {
                reject(errorTexts.userRole)
            }

            if (!ObjectID.isValid(data.flightId)) {
                reject(errorTexts.mongId)
            }

            Helper.validateData(data)
                .then(FlightHelper.getFlight)
                .then(FlightHelper.getFlightAvailableSeats)
                .then(validateNumberOfSeats)
                .then(checkClassName)
                .then(saveClass)
                .then(data => {
                    resolve({
                        code: 200,
                        status: "success",
                        message: "Class successfully created"
                    })
                })
                .catch(reject)
        });
    },

    /**
     *
     * @param req
     * @returns {Promise<any>}
     */
    edit: req => {

        const possibleFields = {
            className: {
                name: "Class Name",
                type: "text",
                minLength: 1,
                maxLength: 6,
                required: true
            },
            classType: {
                name: "classType",
                type: "text",
                format: "latin",
                minLength: 3,
                maxLength: 64,
                required: true
            },
            numberOfSeats: {
                name: "Number Of Seats",
                type: "number",
                minLength: 1,
                maxLength: 4,
                required: true
            },
            fareRules: {
                name: "Fare Rules",
                type: "text",
                minLength: 1,
                maxLength: 500,
                required: true
            },
            fareAdult: {
                name: "Fare ADULT",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            fareChd: {
                name: "Fare CHD",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            fareInf: {
                name: "Fare INF",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            taxXAdult: {
                name: "Tax X ADULT",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            taxYAdult: {
                name: "Tax Y ADULT",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            taxXChd: {
                name: "Tax X CHD",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            taxYChd: {
                name: "Tax Y CHD",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            cat: {
                name: "CAT",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            surchargeMultiDestination: {
                name: "Surcharge MULTIDEST",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            surchargeLongRange: {
                name: "Surcharge LONG RANGE",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            surchargeShortRange: {
                name: "Surcharge SHORT RANGE",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            commAdult: {
                name: "Comm ADULT",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            },
            commChd: {
                name: "Comm CHD",
                type: "number",
                minLength: 1,
                maxLength: 5,
                required: true
            }
        };

        let data = {
            body: req.body,
            userInfo: req.userInfo,
            possibleForm: possibleFields,
            editableFields: possibleFields,
            editableFieldsValues: req.body,
            classId: req.params.classId.toString(),
        };

        return new Promise((resolve, reject) => {
            if ("Admin" !== data.userInfo.role) {
                reject(errorTexts.userRole)
            }

            if (!ObjectID.isValid(data.classId)) {
                reject(errorTexts.mongId)
            }

            return new Promise((resolve, reject) => {
                Helper.getEditableFields(data)
                    .then(Helper.getEditableFieldsValues)
                    .then(Helper.validateData)
                    .then(resolve)
                    .catch(reject)
            })
                .then(updateClass)
                .then(data => {
                    resolve(successTexts.classUpdated)
                })
                .catch(reject)
        });

    },

    /**
     *
     * @param req
     * @returns {Promise<any>}
     */
    delete: req => {
        let data = {
            userInfo: req.userInfo,
            classId: req.params.classId.toString(),
        };

        return new Promise((resolve, reject) => {
            if ("Admin" !== data.userInfo.role) {
                reject(errorTexts.userRole)
            }

            if (!ObjectID.isValid(data.classId)) {
                reject(errorTexts.mongId)
            }

            removeClass(data)
                .then(data => {
                    resolve(successTexts.classDeleted)
                })
                .catch(reject)
        })
    },

    /**
     *
     * @param req
     * @returns {Promise<any>}
     */
    getByFlightId: req => {
        let data = {
            userInfo: req.userInfo,
            flightId: req.params.flightId.toString()
        };

        return new Promise((resolve, reject) => {
            if ("Admin" !== data.userInfo.role) {
                reject(errorTexts.userRole)
            }

            if (!ObjectID.isValid(data.flightId)) {
                reject(errorTexts.mongId)
            }

            getClassesByFlightId(data)
                .then(data => {
                    resolve({
                        code: 200,
                        status: "Success",
                        message: "Flight info successfully goten!",
                        data: data.result
                    })
                })
                .catch(reject)
        })
    },

    /**
     *
     * @param req
     * @returns {Promise<any>}
     */
    getClassByClassId: req => {
        let data = {
            userInfo: req.userInfo,
            classId: req.params.classId.toString()
        };

        return new Promise((resolve, reject) => {
            if (!ObjectID.isValid(data.classId)) {
                reject(errorTexts.mongId)
            }

            getClassesByClassId(data)
                .then(data => {
                    resolve({
                        code: 200,
                        status: "Success",
                        message: "Flight info successfully goten!",
                        data: data.result
                    })
                })
                .catch(reject)
        })
    }
};

module.exports = classInfo;

/**
 *
 * @param data
 * @returns {Promise<any>}
 */
function saveClass(data) {
    let currentTime = Math.floor(Date.now() / 1000);

    let classInfo = {
        flightId:                   data.flightId,
        className:                  data.body.className,
        classType:                  data.body.classType,
        travelType:                 data.body.travelType,
        currency:                   data.flightInfo.currency,
        numberOfSeats:              parseFloat(data.body.numberOfSeats),
        availableSeats:             parseFloat(data.body.numberOfSeats),
        fareRules:                  data.body.fareRules,
        fareAdult:                  parseFloat(data.body.fareAdult),
        fareChd:                    parseFloat(data.body.fareChd),
        fareInf:                    parseFloat(data.body.fareInf),
        taxAdult:                   parseFloat(data.body.taxAdult),
        taxChd:                     parseFloat(data.body.taxChd),
        cat:                        parseFloat(data.body.cat),
        surchargeMultiDestination:  parseFloat(data.body.surchargeMultiDestination),
        surchargeLongRange:         parseFloat(data.body.surchargeLongRange),
        surchargeShortRange:        parseFloat(data.body.surchargeShortRange),
        commChd:                    parseFloat(data.body.commChd),
        commAdult:                  parseFloat(data.body.commAdult),
        chargeFeeAdult:             parseFloat(data.body.chargeFeeAdult),
        chargeFeeChild:             parseFloat(data.body.chargeFeeChild),
        chargeFeeInfant:            parseFloat(data.body.chargeFeeInfant),
        updatedAt:                  currentTime,
        createdAt:                  currentTime
    };

    data.classDocumetInfo = classInfo;

    let documentInfo = {};
    documentInfo.collectionName = "classes";
    documentInfo.documentInfo = classInfo;

    return new Promise((resolve, reject) => {
        mongoRequests.insertDocument(documentInfo)
            .then(insertRes => {
                insertRes.insertedCount === 1
                    ? resolve(data)
                    : reject(errorTexts.cantSaveDocumentToMongo)
            })
    });
}

/**
 *
 * @param data
 * @returns {Promise<any>}
 */
function validateNumberOfSeats(data) {
    let usedSeats = data.existedClassesInfo.totalSeats;
    let totalSeats = data.flightInfo.numberOfSeats;
    let requestedSeats = Number(data.body.numberOfSeats);

    // console.log(totalSeats, usedSeats, requestedSeats);body

    return new Promise((resolve, reject) => {
        if (totalSeats < (usedSeats + requestedSeats)) {
            let availableSeatsCount = totalSeats - usedSeats;

            reject({
                code: 401,
                status: "error",
                message: "There is no enough space: You can add only "+ availableSeatsCount
            })
        }
        else {
            resolve(data)
        }
    })

}

/**
 *
 * @param data
 * @returns {Promise<any>}
 */
function checkClassName(data) {
    return new Promise((resolve, reject) => {
        _.each(data.existedClassesInfo.class, existedClass => {
            if (data.body.className === existedClass.name) {
                reject({
                    code: 401,
                    status: "error",
                    message: "Class with this name already exists!"
                })
            }
        });

        resolve(data)
    });
}

/**
 *
 * @param data
 * @returns {Promise<any>}
 */
function updateClass(data) {
    let currentTime = Math.floor(Date.now() / 1000);

    let updateInfo = data.editableFieldsValues;
    updateInfo.updatedAt = currentTime;

    let documentInfo = {};
    documentInfo.collectionName = "classes";
    documentInfo.filterInfo = {_id: ObjectID(data.classId)};
    documentInfo.updateInfo = {'$set': updateInfo};

    return new Promise((resolve, reject) => {
        mongoRequests.updateDocument(documentInfo)
            .then(updateRes => {
                updateRes.ok === 1
                    ? resolve(data)
                    : reject(errorTexts.cantUpdateMongoDocument)
            })
    });
}

/**
 *
 * @param data
 * @returns {Promise<any>}
 */
function removeClass(data) {
    let currentTime = Math.floor(Date.now() / 1000);

    let updateInfo = {
        status: "deleted",
        updatedAt: currentTime,
        deletedAt: currentTime
    };

    let documentInfo = {};
    documentInfo.collectionName = "classes";
    documentInfo.filterInfo = {_id: ObjectID(data.classId)};
    documentInfo.updateInfo = {'$set': updateInfo};

    return new Promise((resolve, reject) => {
        mongoRequests.updateDocument(documentInfo)
            .then(updateRes => {
                updateRes.ok === 1
                    ? resolve(data)
                    : reject(errorTexts.cantUpdateMongoDocument)
            })
    });
}

/**
 *
 * @param data
 * @returns {Promise<any>}
 */
function getClassesByFlightId(data) {
    let documentInfo = {};
    documentInfo.collectionName = "classes";
    documentInfo.filterInfo = {flightId: data.flightId};
    documentInfo.projectionInfo = {};

    return new Promise((resolve, reject) => {
        mongoRequests.findDocuments(documentInfo)
            .then(docInfo => {
                data.result = docInfo;

                resolve(data)
            })
            .catch(reject)
    });
}

function getClassesByClassId(data) {
    let documentInfo = {};
    documentInfo.collectionName = "classes";
    documentInfo.filterInfo = {_id: ObjectID(data.classId)};
    documentInfo.projectionInfo = {};

    return new Promise((resolve, reject) => {
        mongoRequests.findDocument(documentInfo)
            .then(docInfo => {
                data.result = docInfo;

                resolve(data)
            })
            .catch(reject)
    });
}

