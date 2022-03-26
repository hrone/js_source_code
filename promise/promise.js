const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        throw new TypeError('循环引用~~')
    }

    //检查x 是promise 还是普通值

    if ((x && typeof x === 'object') || typeof x === 'function') {
        try {
            const {then} = x
            if (typeof then === 'function') {
                then.call(x, y => {
                    resolvePromise(promise2, y, resolve, reject)
                }, r => {
                    reject(r)
                })
            } else {
                resolve(x)
            }
        } catch (e) {
            reject(e)
        }
    } else {
        resolve(x)
    }
}

class Promise1 {
    constructor(executor) {
        this.status = PENDING
        this.value = null
        this.reason = null

        this.onFulfilledCallbacks = []
        this.onRejectledCallbacks = []

        const resolve = value => {
            if (this.status === PENDING) {
                this.value = value
                this.status = FULFILLED
                this.onFulfilledCallbacks.forEach(fn => fn())
            }
        }

        const reject = reason => {
            if (this.status === PENDING) {
                this.reason = reason
                this.status = REJECTED
                this.onRejectledCallbacks.forEach(fn => fn())
            }
        }

        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }

    }

    // todo: 补充then的实现md
    then(onfulfilled, onrejected) {
        onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : value => value
        onrejected = typeof onrejected === 'function' ? onrejected : err => {
            throw new Error(err)
        }

        const promise2 = new Promise1((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        const x = onfulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }

                }, 0)
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        const x = onrejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }

                }, 0)
            }
            if (this.status === PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onfulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }

                    }, 0)
                })
                this.onRejectledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onrejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }

                    }, 0)
                })
            }
        })

        return promise2
    }
}

