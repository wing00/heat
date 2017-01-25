from sklearn.linear_model import SGDClassifier
from sklearn.externals import joblib
import numpy
import csv

"""
Basic online model with high dimensional features
Saves features weights as csv for visualization purposes
"""


def load_data():
    """
    Loads training data from MNIST

    :return: header, training, target
    """

    with open('./static/features/train.csv', 'rb') as f:
        spam = csv.reader(f)
        train = numpy.array(list(spam))

    data = numpy.vsplit(train, [1, len(train)])
    train = numpy.hsplit(data[1], [1, len(data[1])])

    return data[0], train[1], train[0].ravel()


def create_model(X, y):
    """
    Creates SGDClassifier, fits it to initial data, and then pickles for future use

    :param X: train data
    :param y: target label
    """

    sgd = SGDClassifier()
    sgd.fit(X, y)

    with open('./static/features/coef0.csv', 'wb') as f:
        spam = csv.writer(f)
        spam.writerow(["row", "col", "weight"])
        for row, items in enumerate(sgd.coef_):
            for col, item in enumerate(items):
                spam.writerow([row, col, item])

    joblib.dump(sgd, 'sgd.pkl')


def update_model(X, y, i):
    """
    Runs partial fit on model with new data and saves

    :param X: train data
    :param y: target label
    :param i: current iteration
    """

    sgd = joblib.load('sgd.pkl')
    sgd.partial_fit(X, y)
    joblib.dump(sgd, 'sgd.pkl')

    with open('./static/features/coef{}.csv'.format(i), 'wb') as f:
        spam = csv.writer(f)
        spam.writerow(["row", "col", "weight"])
        for row, items in enumerate(sgd.coef_):
            for col, item in enumerate(items):
                spam.writerow([row, col, item])


if __name__ == '__main__':
    header, train, target = load_data()

    with open('./static/features/header.csv', 'wb') as f:
        spam = csv.writer(f)
        for item in header:
            spam.writerow(item)

    # splitting training data into 10 parts for simulation purposes
    trains = numpy.array_split(train, 10)
    targets = numpy.array_split(target, 10)

    create_model(trains[0], targets[0])

    # using a map in case parallel code is needed later
    map(update_model, trains[1:], targets[1:], range(1, 10))
