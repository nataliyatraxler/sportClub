# Final project Advanced JavaScript

## Based on Vanilla App Template

Цей проект було створено за допомогою Vite. Для знайомства та налаштування
додаткових можливостей [звернись до документації](https://vitejs.dev/).

## Документація по роботі з об'єктом API:

1. Файл знаходиться за адресою src/api/your-energy-api.js
2. Імпортувати треба об'єкт 'yourEnergy'
3. Всі методи об'єкту повертають:
    - при успішній відповіді - об'єкт з даними,
    - при помилці - строку. Текст строки адаптований для юзера та може бути
      одразу переданий для рендеру
4. Методи об'єкта:

    ### Отримати список вправ по заданим параметрам, враховуючи пагінацію.

    - async yourEnergy.getExercises(params), де params = {bodypart?: sting,
      muscles?: sting, equipment?: sting, keyword?: sting, page: number, limit:
      number}

    ### Додати рейтинг

    - async yourEnergy.addRating(id, rate, email, review) де id: string -
      exercise id, rate: number - rate number, email: string, review: string -
      коментар

    ### Отримати вправу за id

    - async getExerciseById(id), де id: string - exercise id

    ### Отримати список вправ за фільтром, враховуючи пагінацію

    - async getExercisesByFilter(params), де params={filter: 'Body parts' |
      'Muscles' | 'Equipment', page: number, limit: number}

    ### Оформити підписку

    - async orderSubscription(email), де email: string,

    ### Отримати список вправ за масивом id цих вправ без пагінації

    - await yourEnergy.getExercisesByIdList(array) де array: string[] - масив id
      вправ.

    ### Отримати цитату

    - await yourEnergy.getQuote()
