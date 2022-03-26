const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class Promise1 {
    constructor(executor) {
        this.status = PENDING
        this.value = null
        this.reason = null

        const resolve = value => {
            if (this.status === PENDING) {
                this.value = value
                this.status = FULFILLED
            }
        }

        const reject = reason => {
            if (this.status === PENDING) {
                this.reason = reason
                this.status = REJECTED
            }
        }

        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }

    }
}

