/// <reference path="../common.js" />
/// <reference path="../Tree/gzy.tree.js" />

(function (base) {
    subject = {
        getAllSubjects:function (callback) {
            return base('GetAllSubjects', {}, callback);
        },
    },
    kpoint = {
        getTree: function(subjectId,callback){
            return base('GetKpTree',{subjectId:subjectId},callback)
        } ,

        getNodes: function (success) {
            return base('GetKpNodes', success);
        },
        update: function (point, success) {
            return base('UpdateKpNode', { kp: point }, success);
        },
        remove: function (id, success) {
            return base('DeleteKpNode', { kpid: id }, success);
        }
    };
    paper = { //套卷
        getList: function (params, success) {
            return base('GetPaperList', params, success);
        },
        getUnAuditList:function (params, success) {
            return base('GetUnAuditPaperList', params, success);
        },
        getPaper: function (id, callback) {
            return base('GetPaperInfo', { paperId: id }, callback);
        },
        getQuestions: function (id) {
            return base('GetPaperQuestions', { paperId: id }, function (d) {
            });
        },
        remove: function (ids, success) {
            return base('DeletePaper', { ids: ids }, success);
        },
        update: function (paper, success) {
            return base('UpdatePaper', { paper: paper }, success);
        },
        audit: function (ids, pass, success) {
            return base('AuditPaper', { ids: ids, pass: pass }, success);
        },
        replaceProblem: function (paperId, index, id, success) {
            return base('ReplacePaperProblem', { paperId: paperId, index: index, id: id }, success);
        },
        getImportLog: function (maxlogNum,success) {
            return base('GetImportLog', { type: 2, maxLogNum: maxlogNum }, success);
        },
        removeProblem: function (params, success) {
            return base('DelPaperProblem', params, success);//DelPaperProblem
        }
    };
    problem = { //试题
        getList: function (params, success) {
            return base('GetProblemList', params, success);
        },
        getListByState: function (params, success) {
            return base('GetProblemListByState', params, success);
        },
        getListByIds: function (ids, grid) {
            return base('GetProblemListByIds', { ids: ids }, function (d) {
                //grid.source = 'problib.asmx/GetProblemList';
                grid.fill(d, params);
            });
        },
        getProblem: function (id, success) {
            return base('GetProblem', { problemId: id }, success);
        },
        getImportProlbem: function (importInfoId, probId, success) {
            return base('GetImportProblem', { importInfoId: importInfoId, problemId: probId }, success);
        },
        getProblemWithStyle: function (id, success) {
            return base('GetProblemWithStyle', { problemId: id }, success);
        },
        remove: function (ids, success) {
            return base('DeleteProblems', { problemIds: ids }, success);
        },
        removeAllUnAudit: function ( success) {
            return base('DeleteAllUnAuditProblems', { }, success);
        },
        update: function (problem, success) {
            return base('UpdateProblem', { problem: problem }, success);
        },
        audit: function (ids, pass, success) {
            return base('AuditProblem', { probIds: ids, pass: pass }, success);
        },
        auditAllProbs: function (pass, success) {
            return base('AuditAllProbs', { pass: pass }, success);
        },
        getTypesAndCount: function (success) {
            return base('GetTypesAndCount', success);
        },
        getTypesAndCountInKps: function (kpIds,success) {
            return base('GetTypesAndCountInKPs', {kpIds:kpIds}, success);
        },
        getProblemCountInKP: function (success) {
            return base('GetProblemCountInKP', success);
        },
        getDifficultCount: function (kpids, success) {
            return base('GetTypesAndDifficultCount', { kpids: kpids }, success);
        },
        getCounter: function (params, success) {
            return base('GetCounter', params, success);
        },
        getImportedProbs: function () {
            return base('GetImportedProblems');
        },
        getImportLog: function (maxlogNum,success) {
            return base('GetImportLog', { type: 1, maxLogNum: maxlogNum }, success);
        },
        close: function (id,success) {
            return base('CloseImportInfo', { id: id }, success);
        },
    };
    probType = {
        getList: function (params, grid) {
            return base('GetTypeList', params, function (d) {
                if (grid instanceof DataGrid) {
                    grid.fill(d, params);
                } else if (grid instanceof Function) {
                    grid(d);
                }
            });
        },
        getAllTypes: function (callback) {
            return base('GetTypeList', {},callback);
        },

        getType: function (id) {
            return base('GetProblemType', { problemId: id }, function (d) {
            });
        },
        remove: function (id) {
            return base('DeleteProblemType', { problemId: id }, function (d) {
            });
        },
        update: function (prob, success) {
            return base('UpdateType', { type: prob }, success);
        }
    };
    extendType = {
        getList: function (params, grid) {
            return base('GetAllExtendTypes', params, function (d) {
                if (grid instanceof DataGrid) {
                    grid.fill(d, params);
                } else if (grid instanceof Function) {
                    grid(d);
                }
            });
        },
        getAllExtendTypes: function (params, callback) {
            return base('GetAllExtendTypes', params, callback);
        },
        create: function (params,callback) {
            return base('CreateExtendType', params, callback);
        },
        update: function (params, callback) {
            return base('UpateExtendType', params, callback);
        },
        del: function (id, callback) {
            return base('DeleteExtendType', { id: id }, callback);
        }
    };
    pLib = {
        add2Lib: function (probId,category, callback) {
            return base('AddToLib', { probId: probId, category: category }, callback);
        },
        getList: function (params, success) {
            return base('GetLibProblemList', params, success);
        },
        remove: function (ids, success) {
            return base('RemoveFromLib', { ids: ids }, success);
        }
    };
   

})(function (method, data, callback) {
    return jQuery.service.call(this, 'problib.asmx/' + method, data, callback);
});
