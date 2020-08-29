function generateNewClassifierModel(training_data, model_setting) {
    var final = {
        classifier: null,
        accuracy: null,
        error: null
    }

    var models = []


    var limit = training_data.length / 10;

    var offset = 0

    for (var n = 0; n < 10; n++) {
        var trainingDataSet = training_data

        var test_data = []
        var index = offset
        var count = 0
        while (count < limit) {


            let sample = trainingDataSet[index];

            if (sample == undefined) {
                break
            }

            test_data.push(sample)

            trainingDataSet.splice(index, 1)


            index++;
            count++;
        }

        var output = generateClassifierFromDataSetNew(training_data, test_data, model_setting)

        if (output.accuracy > final.accuracy || final.accuracy == null) {
            final = output
        }
        models.push(output)
    }

    console.log(final)
    console.log(models)
    return{
        final,
        models
    }
}

function generateClassifierFromDataSetNew(trainingData, test_data, model_setting) {
    var classifier = new jsregression.MultiClassLogistic({
        alpha: Number(model_setting.alpha),
        iterations:  Number(model_setting.iterations),
        lambda: Number(model_setting.lambda)
    });

    classifier.fit(trainingData);

    //console.log(classifier)
    let result = test_data.map((test) => {
        var actual = test.pop()
        var predicted = classifier.transform(test)
        predicted = predicted.sort(compare)
        return {
            predicted: predicted,
            actual: actual
        }
    })

    var error = result.filter((item) => {
        let halfWayThough = Math.floor(item.predicted.length / 2) + 1
        let arrayFirstHalf = item.predicted.slice(0, halfWayThough);
        let arraySecondHalf = item.predicted.slice(halfWayThough, item.predicted.length);

        for (var i = 0; i < arrayFirstHalf.length; i++) {
            if (arrayFirstHalf[i].class == item.actual)
                return false
        }
        return true
    })
    //console.log(result)
    //console.log(error)
    let accuracy = ((result.length - error.length) / result.length) * 100
    //console.log(accuracy)
    return {
        classifier,
        accuracy,
        error: error.length
    }
}

function compare(a, b) {
    if (a.data > b.data)
        return -1;
    if (a.data < b.data)
        return 1;
    return 0;
}