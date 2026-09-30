// Generated from the "Full-Stack Development" module syllabus (Lessons 1-21):
// React & JSX, Hooks, Router, Context, TypeScript, Python OOP/files/Flask,
// C# fundamentals/OOP/LINQ, ASP.NET Core/EF Core/JWT/Swagger, SQL Server & MongoDB.
window.QUESTION_SET = {
  id: "fullstack-syllabus-v1",
  title: "Full-stack syllabus: React, TypeScript, Python, C#/.NET, SQL & MongoDB",
  questions: [
    // Lesson 1 - React & JSX
    {
      id: "l1_q1", topic: "React basics", difficulty: "easy",
      question: "What problem does React actually solve, and what is the virtual DOM's role in that?",
      keyPoints: [
        "Lets you build UIs from reusable, composable components instead of manual DOM manipulation",
        "Virtual DOM is an in-memory tree React diffs against the previous render",
        "Only the minimal set of real DOM changes gets applied (reconciliation) instead of re-rendering everything"
      ],
      modelAnswer: "React replaces manual, imperative DOM manipulation with a declarative, component-based model: you describe what the UI should look like for a given state, and React figures out how to update the page. It does this efficiently via the virtual DOM, an in-memory representation of the UI tree. When state changes, React builds a new virtual tree, diffs it against the previous one, and applies only the minimal set of real DOM operations needed, instead of re-rendering the whole page."
    },
    {
      id: "l1_q2", topic: "JSX", difficulty: "medium",
      question: "JSX looks like HTML but isn't. What are the practical differences, and why does a component have to return a single root element?",
      keyPoints: [
        "JSX compiles down to React.createElement calls, not real HTML",
        "className instead of class, camelCase event handlers (onClick), {} for JS expressions",
        "A function can only return one value, so JSX must resolve to one root node (or a Fragment)"
      ],
      modelAnswer: "JSX is syntactic sugar that compiles to nested React.createElement() calls, which is why its rules differ from HTML: className instead of class (class is a reserved JS word), camelCase event handlers like onClick, and curly braces to embed real JavaScript expressions. Since a component is just a function, and a function call tree ultimately has to resolve to one value, JSX has to have a single root element - that's why sibling elements need a wrapping div or a Fragment (<>...</>)."
    },

    // Lesson 2 - useState & useEffect
    {
      id: "l2_q1", topic: "useState & useEffect", difficulty: "medium",
      question: "Walk through what happens, render by render, for a useEffect with a dependency array of [count] in a counter component.",
      keyPoints: [
        "Effect runs after the DOM commits, not during render",
        "Re-runs only when a value in the dependency array changes between renders",
        "Empty array [] means run once on mount; no array means run after every render"
      ],
      modelAnswer: "On the first render, the component mounts, React commits it to the DOM, and then the effect runs once. On any later render triggered by setCount, React compares the new value of count to the value captured last time the effect ran; if it changed, the effect runs again after that render commits. If count didn't change (a re-render caused by something else), the effect is skipped. That's different from an empty array, which always means 'run once on mount, never again', and from no array at all, which reruns after every single render."
    },
    {
      id: "l2_q2", topic: "Controlled components", difficulty: "medium",
      question: "What makes an input a 'controlled component' in React, and what breaks if you set its value from state but forget the onChange handler?",
      keyPoints: [
        "The input's displayed value comes from React state, not the DOM's own internal state",
        "onChange must update that state, or the input becomes read-only",
        "Without onChange, every keystroke is immediately overwritten back to the stale state value"
      ],
      modelAnswer: "A controlled component's value prop is driven entirely by React state - React, not the browser, owns the source of truth. That means you also need an onChange handler that updates that state whenever the user types, otherwise the input effectively freezes: the user types a character, the DOM briefly shows it, but on the next render React sets value back to the old, unchanged state, so the field appears read-only."
    },

    // Lesson 3 - React Router
    {
      id: "l3_q1", topic: "React Router", difficulty: "easy",
      question: "Why does clicking a React Router <Link> feel instant while a plain <a href> reloads the whole page?",
      keyPoints: [
        "Link intercepts the click and updates the URL/history via JS, no network round-trip",
        "A plain anchor tag triggers a full browser navigation",
        "Full reload throws away all client-side React state"
      ],
      modelAnswer: "<Link> renders an anchor tag under the hood, but it intercepts the click event, prevents the default browser navigation, and instead updates the URL through the History API while React swaps in the matching route's component - all without hitting the server. A plain <a href> has no such interception, so the browser does a full page reload: a new HTML document is fetched and the entire JS app, including all its state, starts over from scratch."
    },
    {
      id: "l3_q2", topic: "Dynamic routes", difficulty: "medium",
      question: "You have a route defined as <Route path=\"/students/:id\" element={<StudentDetail />} />. How does StudentDetail actually get the id value, and where would you put a catch-all 404 route?",
      keyPoints: [
        "useParams() reads the :id segment inside the matched component",
        "Route order matters; the wildcard route (path=\"*\") must be listed last",
        "Catch-all matches anything not matched by an earlier, more specific route"
      ],
      modelAnswer: "Inside StudentDetail, calling useParams() returns an object like { id: '42' } parsed from the current URL. For a 404 page, you add a route with path=\"*\" and place it last in the <Routes> list - React Router matches top to bottom, so an earlier catch-all would swallow every other route before they get a chance to match."
    },

    // Lesson 4 - Data fetching & Context
    {
      id: "l4_q1", topic: "Data fetching", difficulty: "medium",
      question: "What's the minimum state you need to track when fetching data in useEffect, and why?",
      keyPoints: [
        "loading, data, and error tracked separately",
        "Lets the UI show a spinner, the result, or an error message at the right time",
        "Avoids showing stale or wrong data while a request is in flight"
      ],
      modelAnswer: "At minimum you need loading, data, and error as separate pieces of state. Loading starts true and flips to false once the request settles either way; data holds the successful result; error holds anything that went wrong. Keeping them separate - rather than, say, inferring 'loading' from data being null - lets the component render the correct UI at each stage: a spinner while loading is true, the error message if error is set, and the real content once data has arrived."
    },
    {
      id: "l4_q2", topic: "Context API", difficulty: "medium",
      question: "What problem does the Context API solve that plain props don't, and when would using it actually be the wrong call?",
      keyPoints: [
        "Avoids prop drilling - passing data through components that don't use it themselves",
        "Provider makes a value available to any descendant via useContext",
        "Poor fit for state that changes very frequently, since every consumer re-renders on change"
      ],
      modelAnswer: "Context solves prop drilling: without it, sharing a value like the logged-in user across a deep component tree means threading it through every intermediate component as a prop, even ones that never use it. A Provider makes the value available directly to any descendant that calls useContext, skipping the middle layers. The trade-off is that every component consuming that context re-renders whenever the value changes, so it's a poor fit for fast-changing state - like mouse position or a text input on every keystroke - where a more targeted state solution works better."
    },

    // Lesson 5 - TypeScript basics
    {
      id: "l5_q1", topic: "TypeScript types", difficulty: "easy",
      question: "What's the difference between typing a value as any versus unknown, and why would you prefer one over the other?",
      keyPoints: [
        "any disables type checking entirely for that value",
        "unknown is type-safe - you must narrow it before using it",
        "unknown catches mistakes any would silently let through"
      ],
      modelAnswer: "Both represent 'a value whose type isn't known yet', but any turns off type checking for it completely - you can call any method or access any property on it and the compiler won't complain, even if it's wrong. unknown is the safer alternative: TypeScript forces you to narrow it first, for example with a typeof or instanceof check, before you're allowed to do anything with it. In practice, prefer unknown for genuinely uncertain values and treat any as something to avoid, since it silently reintroduces the exact bugs TypeScript exists to catch."
    },
    {
      id: "l5_q2", topic: "Generics", difficulty: "medium",
      question: "Why would you write a generic function like function getFirst<T>(items: T[]): T instead of just typing items as any[]?",
      keyPoints: [
        "Generics preserve the specific type through the function, any[] loses it",
        "Caller gets a properly-typed return value without re-annotating",
        "Keeps full type safety while still being reusable across types"
      ],
      modelAnswer: "With any[], the function is reusable but the type information is lost - the return value comes back as any, so nothing downstream is checked. With a generic <T>, TypeScript infers T from whatever array is actually passed in, so calling getFirst(students) returns a properly-typed Student, and calling getFirst(numbers) returns a number - one implementation, full type safety preserved for every call site, without needing to write a separate function per type."
    },

    // Lesson 6 - TypeScript with React
    {
      id: "l6_q1", topic: "Typed useState", difficulty: "medium",
      question: "Why does useState(null) sometimes cause a type error the moment you try to assign a real object to it later?",
      keyPoints: [
        "TypeScript infers the state's type purely from the initial value",
        "useState(null) is inferred as type null, not 'User or null'",
        "Fix: annotate explicitly, e.g. useState<User | null>(null)"
      ],
      modelAnswer: "TypeScript infers a useState call's type from its initial argument. If you write useState(null) with no annotation, TypeScript infers the state's type as exactly null - not 'User or null' - so any later call like setUser({ id: 1, name: 'Amy' }) is a type mismatch. The fix is to annotate the hook explicitly: useState<User | null>(null), which tells TypeScript the state can hold either a User or null from the start."
    },
    {
      id: "l6_q2", topic: "Typed props & events", difficulty: "medium",
      question: "How would you type a button component's onClick prop so it matches what a real <button> passes to its own onClick handler?",
      keyPoints: [
        "Define a props interface with onClick as a function type",
        "Use React's built-in event type: React.MouseEvent<HTMLButtonElement>",
        "Keeps the handler's event argument correctly typed inside the component"
      ],
      modelAnswer: "You'd define an interface where onClick is typed as (e: React.MouseEvent<HTMLButtonElement>) => void, using React's own MouseEvent generic parameterized with the specific element type. That way, whatever function the parent passes in gets checked against the real shape of a button click event, and inside the handler, e has all the properties a real click event actually carries - no need to fall back to any for the event argument."
    },

    // Lesson 7 - Custom hooks & performance
    {
      id: "l7_q1", topic: "Custom hooks", difficulty: "medium",
      question: "What actually makes something a 'custom hook' in React, versus just a regular helper function?",
      keyPoints: [
        "Its name starts with 'use' by convention, which lets React's rules-of-hooks linting apply",
        "It calls other hooks internally (useState, useEffect, etc.)",
        "It packages up reusable stateful logic that can be shared across components"
      ],
      modelAnswer: "A custom hook is just a JavaScript function, but by convention its name starts with 'use', which is what lets React's linter enforce the rules of hooks on it (like not calling it conditionally). What makes it a hook rather than a plain utility function is that it calls other hooks internally - useState, useEffect, and so on - to encapsulate some reusable piece of stateful logic, like a useLocalStorage hook that wraps state plus an effect that syncs it to localStorage, so multiple components can share that behavior without duplicating it."
    },
    {
      id: "l7_q2", topic: "Memoization", difficulty: "hard",
      question: "When is wrapping a value in useMemo actually worth it, and when is it just added complexity for no benefit?",
      keyPoints: [
        "Worth it for genuinely expensive computations recalculated on every render",
        "Also worth it when the referential stability matters, e.g. passed to a memoized child",
        "Not worth it for cheap computations - the memoization overhead can exceed the savings"
      ],
      modelAnswer: "useMemo is worth reaching for when a calculation is genuinely expensive - filtering or transforming a large list, for instance - and would otherwise re-run on every render even though its inputs haven't changed. It's also worth it when you need referential stability, like passing a computed object to a React.memo-wrapped child, where a new object reference every render would defeat the memoization. For a cheap computation, like formatting a short string, useMemo just adds the cost of comparing dependencies each render without saving anything meaningful - it's optimizing something that was never the bottleneck."
    },

    // Lesson 8 - Python OOP
    {
      id: "l8_q1", topic: "Python OOP", difficulty: "easy",
      question: "In Python, what's the actual difference between __str__ and __repr__, and when does each get used?",
      keyPoints: [
        "__str__ is the readable, user-facing string, used by print() and str()",
        "__repr__ is the unambiguous, developer-facing string, used in the REPL/debugger and as a fallback for __str__",
        "If only __repr__ is defined, print() falls back to it"
      ],
      modelAnswer: "__str__ defines the readable representation meant for end users - it's what print(obj) and str(obj) call. __repr__ defines the unambiguous, developer-facing representation, ideally something that could recreate the object; it's what shows up when you inspect a value in a REPL or debugger, and it's also the automatic fallback if a class only defines __repr__ and not __str__."
    },
    {
      id: "l8_q2", topic: "Encapsulation in Python", difficulty: "medium",
      question: "Does prefixing an attribute with a double underscore, like self.__balance, actually make it private in Python?",
      keyPoints: [
        "No - Python has no enforced access modifiers like private/protected",
        "Double underscore triggers name mangling (_ClassName__balance), not real privacy",
        "Single underscore is purely a 'internal use' convention"
      ],
      modelAnswer: "Not really. Python doesn't have a true private access modifier the way C# or Java does. A double leading underscore triggers name mangling - the attribute is actually stored as _ClassName__balance - which mostly prevents accidental name collisions in subclasses, but it's still accessible from outside if you know (or look up) the mangled name. A single leading underscore, like _balance, carries no enforcement at all; it's purely a convention signaling 'treat this as internal'."
    },

    // Lesson 9 - File handling
    {
      id: "l9_q1", topic: "File handling", difficulty: "easy",
      question: "Why is with open(path) as f: preferred over calling open() and close() manually?",
      keyPoints: [
        "with is a context manager - guarantees the file closes on the way out",
        "Closes the file even if an exception is raised inside the block",
        "Manual close() is skipped if an exception happens before it runs"
      ],
      modelAnswer: "The with statement uses the file object as a context manager, which guarantees f.close() is called when the block exits - whether it exits normally or because an exception was raised partway through. If you open a file manually and call close() at the end of the function, any exception raised between the open and that close call skips it entirely, leaking the file handle. with removes that failure mode."
    },
    {
      id: "l9_q2", topic: "Exception handling in file I/O", difficulty: "medium",
      question: "What's wrong with wrapping file-reading code in a bare except: block instead of except FileNotFoundError:?",
      keyPoints: [
        "A bare except catches every exception, including bugs unrelated to the file",
        "Makes it hard to tell 'file missing' apart from 'code crashed for another reason'",
        "Catch the specific exception you actually expect and can handle"
      ],
      modelAnswer: "A bare except: silently swallows every kind of exception - not just a missing file, but also things like a typo causing a NameError, or a bug in code that happens to run inside the same try block. That makes real bugs disappear instead of surfacing, and makes debugging much harder. Catching FileNotFoundError specifically means you only handle the case you actually anticipated and know how to recover from, while anything else still propagates and gets noticed."
    },

    // Lesson 10 - Flask
    {
      id: "l10_q1", topic: "Flask APIs", difficulty: "medium",
      question: "A POST /students endpoint returns jsonify(student) with no explicit status code on every path, including validation failures. What's wrong with that, and how would you fix it?",
      keyPoints: [
        "Flask defaults to 200 when no status is given",
        "A validation failure should return 400, a successful create should return 201",
        "Clients checking the status code alone would think a failed request succeeded"
      ],
      modelAnswer: "If no status code is given, Flask defaults every response to 200 - so a request that actually failed validation still reports success to anything checking the status code rather than parsing the body. The fix is to return the tuple form with the right code for what happened: jsonify({'error': ...}), 400 when input is invalid, and jsonify(student), 201 when a new resource is actually created, reserving plain 200 for a successful read or update."
    },
    {
      id: "l10_q2", topic: "Flask request data", difficulty: "easy",
      question: "In a Flask route, what's the difference between request.args, request.json, and request.form?",
      keyPoints: [
        "request.args reads URL query parameters",
        "request.json parses a JSON request body",
        "request.form reads standard form-encoded POST data"
      ],
      modelAnswer: "request.args gives you the query string parameters from the URL, like ?page=2. request.json parses the request body as JSON, which is what you'd read for a typical API call sending a JSON payload. request.form reads traditional form-encoded POST data, the kind an HTML <form> submits by default. Picking the wrong one for how the client actually sent the data means the values come back empty even though the request looks fine."
    },

    // Lesson 11 - C# fundamentals
    {
      id: "l11_q1", topic: "C# value vs reference types", difficulty: "medium",
      question: "You pass a Student class instance into a method that changes one of its properties. After the method returns, is the caller's object changed? What if Student were a struct instead?",
      keyPoints: [
        "class is a reference type - the method receives a reference to the same object",
        "Mutating a property inside the method changes the caller's object too",
        "struct is a value type - the method gets a copy, so the caller's original is untouched"
      ],
      modelAnswer: "Since Student is a class, it's a reference type, so passing it into a method passes a reference to the same object on the heap - any property mutation inside the method is visible to the caller after it returns, because there's only one object. If Student were a struct instead, it's a value type, so the method receives a copy; mutating that copy leaves the caller's original struct completely unchanged."
    },
    {
      id: "l11_q2", topic: "C# access modifiers", difficulty: "easy",
      question: "What's the practical difference between marking a class member public, private, and protected?",
      keyPoints: [
        "public - accessible from anywhere",
        "private - accessible only inside the declaring class",
        "protected - accessible in the declaring class and any subclass"
      ],
      modelAnswer: "public members are accessible from any code that has a reference to the object, including other classes and assemblies. private members are only accessible from inside the class that declared them - the default and safest choice for internal implementation details. protected sits in between: accessible from the declaring class and from any class that inherits from it, but not from unrelated outside code, which is useful for members a subclass needs to build on."
    },

    // Lesson 12 - Control flow & the four pillars
    {
      id: "l12_q1", topic: "OOP pillars", difficulty: "medium",
      question: "In C#, why does marking a base class method override in a subclass sometimes fail to compile?",
      keyPoints: [
        "override requires the base method to be marked virtual or abstract",
        "Without that, the subclass method just hides the base one instead of overriding it",
        "This is what actually enables runtime polymorphism"
      ],
      modelAnswer: "The override keyword only works against a base member explicitly marked virtual or abstract (or itself override). If the base class's method is a plain, non-virtual method, the compiler rejects override on it - you'd have to use new to hide it instead, which is a different mechanism that doesn't give you real polymorphism. Marking the base method virtual is what allows a call through a base-typed reference to dispatch to the subclass's overridden implementation at runtime."
    },
    {
      id: "l12_q2", topic: "Method overloading vs overriding", difficulty: "medium",
      question: "What's the actual difference between method overloading and method overriding in C#?",
      keyPoints: [
        "Overloading: same method name, different parameter lists, resolved at compile time",
        "Overriding: subclass redefines a virtual/abstract base method with the same signature",
        "Overriding is resolved at runtime based on the object's actual type"
      ],
      modelAnswer: "Overloading means defining multiple methods with the same name but different parameter lists in the same class - like Add(int, int) and Add(double, double) - and the compiler picks which one to call based on the argument types at compile time. Overriding means a subclass redefines a base class's virtual or abstract method with the exact same signature, and which version actually runs is decided at runtime based on the object's real type - that's what enables polymorphism, whereas overloading is really just a naming convenience."
    },

    // Lesson 13 - Student Management System pattern
    {
      id: "l13_q1", topic: "Application design", difficulty: "medium",
      question: "In a console CRUD app, why is it better to route every add/search/update through a manager class's methods instead of manipulating the underlying List<Student> directly wherever input is read?",
      keyPoints: [
        "Keeps data-manipulation logic in one place instead of scattered across the UI code",
        "Makes it easy to add validation, sorting, or persistence later without touching every call site",
        "Separates orchestration/logic from input/output handling"
      ],
      modelAnswer: "If every menu option in Main reaches directly into the List<Student> to add or remove items, any change to how that's done - adding validation, preventing duplicate IDs, later swapping the list for a database - has to be repeated everywhere it's used. Routing everything through a manager class's methods means that logic lives in one place; Main's job shrinks to reading input and displaying output, and the manager owns what 'add a student' or 'find a student' actually means. It's the same separation of concerns that later shows up as controller vs. service layers in a real API."
    },

    // Lesson 14 - LINQ, collections, exceptions
    {
      id: "l14_q1", topic: "LINQ", difficulty: "medium",
      question: "What does 'deferred execution' mean for a LINQ query, and how can it surprise you in practice?",
      keyPoints: [
        "A LINQ query doesn't run when it's declared, only when enumerated (foreach, ToList(), etc.)",
        "If the source collection changes between declaring and enumerating, the query sees the changed data",
        "Can cause a query to return unexpected results if you assumed it ran immediately"
      ],
      modelAnswer: "Writing var query = students.Where(s => s.Average > 70) doesn't actually filter anything yet - it just builds a query definition. The filtering only happens when you enumerate the query, whether that's a foreach loop or calling .ToList(). The surprise is that if the students collection is modified after the query is declared but before it's enumerated, the query sees the modified data at enumeration time, not a snapshot from when it was written - which can look like a bug if you assumed LINQ runs eagerly."
    },
    {
      id: "l14_q2", topic: "Exception handling", difficulty: "medium",
      question: "Inside a catch block, what's the difference between throw; and throw ex; when re-raising the caught exception?",
      keyPoints: [
        "throw; re-raises the exception and preserves its original stack trace",
        "throw ex; resets the stack trace to this catch block",
        "throw; is almost always what you want when simply re-raising"
      ],
      modelAnswer: "throw; re-throws the currently-caught exception exactly as it is, preserving the original stack trace - so if you inspect it later, you can still see where it actually originated. throw ex; throws the same exception object, but resets its stack trace to this catch block, erasing the information about where the problem really started. Unless you're deliberately wrapping the exception in a new one, throw; is what you want when simply propagating it further up."
    },

    // Lesson 15 - .NET & ASP.NET Core intro
    {
      id: "l15_q1", topic: "Dependency injection lifetimes", difficulty: "hard",
      question: "Why is registering a database-backed service as Singleton in ASP.NET Core's DI container usually a mistake?",
      keyPoints: [
        "Singleton is created once and lives for the whole app's lifetime",
        "A database context is meant to represent one unit of work, typically per request",
        "Ends up holding a stale/shared connection across unrelated requests, causing subtle bugs under load"
      ],
      modelAnswer: "A Singleton service is instantiated once and reused for every request for as long as the app runs. A database-backed service - one holding a DbContext, for example - is meant to represent a single unit of work, usually scoped to one HTTP request. Registering it as Singleton means every request shares the exact same instance and the same underlying connection/change-tracking state, which causes concurrency bugs and stale data that often don't show up until the app is under real traffic. The fix is registering it as Scoped, so DI creates a fresh instance per request."
    },
    {
      id: "l15_q2", topic: "Middleware pipeline", difficulty: "medium",
      question: "What is ASP.NET Core's middleware pipeline, and why does the order you register middleware in matter?",
      keyPoints: [
        "Requests pass through an ordered chain of middleware components",
        "Each piece can inspect, modify, short-circuit, or pass the request along",
        "Order matters - e.g. authentication middleware must run before authorization middleware"
      ],
      modelAnswer: "The middleware pipeline is an ordered chain of components that every incoming request passes through, each one able to inspect or modify the request, short-circuit and return a response early, or pass it along to the next piece. Order matters because later middleware depends on earlier middleware having already run - for example, authentication middleware has to run before authorization middleware, since authorization needs to know who the user is before it can decide what they're allowed to do."
    },

    // Lesson 16 - ASP.NET Core Web API
    {
      id: "l16_q1", topic: "REST status codes", difficulty: "medium",
      question: "A GetById action always returns Ok(student), even when no student with that id exists (student is null). What's wrong with that, and what should it return instead?",
      keyPoints: [
        "Returning Ok() with null still reports success (200) to the client",
        "The correct response for a missing resource is 404, via NotFound()",
        "Clients relying on the status code alone would incorrectly treat this as a successful lookup"
      ],
      modelAnswer: "Returning Ok(student) when student is null still sends a 200 status code with an empty/null body, which tells the client the lookup succeeded even though nothing was actually found. The action should check for null and return NotFound() instead, giving a proper 404 - that way any client checking the status code (not just trying to parse the body) can correctly distinguish 'found nothing' from 'found it'."
    },
    {
      id: "l16_q2", topic: "Model binding", difficulty: "medium",
      question: "A POST action takes a complex parameter like Create([FromBody] Student s). What happens if you forget the [FromBody] attribute?",
      keyPoints: [
        "Model binding tries to bind complex types from the query string/route by default",
        "Without [FromBody], the JSON request body is effectively ignored",
        "The parameter typically comes back null or with default values"
      ],
      modelAnswer: "Without [FromBody], ASP.NET Core's default model binding for a complex type looks at the route and query string rather than the request body, so a JSON payload sent in the POST body simply isn't picked up. The parameter ends up null (or populated with defaults), even though the client sent a perfectly valid JSON body - the fix is explicitly annotating the parameter with [FromBody] so the framework knows to deserialize it from there."
    },

    // Lesson 17 - EF Core
    {
      id: "l17_q1", topic: "Entity Framework Core", difficulty: "medium",
      question: "You call context.Students.Add(student) but nothing shows up in the database afterward. What's the most likely cause?",
      keyPoints: [
        "Add() only stages the change in memory / the change tracker",
        "Nothing is sent to the database until SaveChanges() (or SaveChangesAsync()) is called",
        "Forgetting SaveChanges() is one of the most common EF Core mistakes"
      ],
      modelAnswer: "Add() only tells EF Core's change tracker that this entity should be inserted - it doesn't touch the database at all. The actual INSERT only happens when you call context.SaveChanges() (or the async version). If that call is missing, the new student exists only in memory for the lifetime of that DbContext and is never persisted, which is exactly why a create endpoint can look like it 'worked' with no errors but nothing actually appears in the table."
    },
    {
      id: "l17_q2", topic: "EF Core migrations & eager loading", difficulty: "medium",
      question: "What do EF Core migrations actually do, and what problem does .Include() solve when querying related data?",
      keyPoints: [
        "Migrations translate model changes into a versioned script that updates the database schema",
        "dotnet ef migrations add generates it, dotnet ef database update applies it",
        ".Include() eager-loads related data in the same query, avoiding the N+1 query problem"
      ],
      modelAnswer: "Migrations let the database schema evolve alongside your C# model classes: dotnet ef migrations add generates a script describing the difference between the model and the current schema, and dotnet ef database update applies it. Separately, .Include(s => s.Courses) tells EF Core to eagerly load the related Courses in the same query as the students, rather than lazily firing a separate query for each student's courses as you access them - which is the N+1 problem, one query for the list plus one more per row."
    },

    // Lesson 18 - JWT auth
    {
      id: "l18_q1", topic: "Authentication vs authorization", difficulty: "easy",
      question: "What's the difference between authentication and authorization, and where does a JWT fit into that?",
      keyPoints: [
        "Authentication answers 'who are you' - verifying identity",
        "Authorization answers 'what are you allowed to do' - checking permissions",
        "A JWT carries the identity/claims from a successful authentication, checked on later requests"
      ],
      modelAnswer: "Authentication is about proving who you are - typically a login endpoint checking a username and password. Authorization is a separate, later question: given that we know who you are, what are you actually allowed to do? A JWT is issued after successful authentication and carries claims about the user's identity (and often their roles); on later requests, the server verifies the token's signature to trust those claims, and authorization logic - like [Authorize(Roles = \"Admin\")] - decides whether that identity is allowed to hit a given endpoint."
    },
    {
      id: "l18_q2", topic: "JWT storage security", difficulty: "hard",
      question: "Why is storing a JWT in localStorage considered riskier than storing it in an httpOnly cookie?",
      keyPoints: [
        "localStorage is readable by any JavaScript running on the page",
        "A single XSS vulnerability can exfiltrate the token",
        "httpOnly cookies aren't accessible to JavaScript at all, closing that attack path"
      ],
      modelAnswer: "Anything stored in localStorage is readable by any JavaScript executing in that page's context, including a third-party script pulled in through a dependency or an XSS vulnerability. If an attacker manages to run even a small amount of script on the page, they can read the token straight out of localStorage and impersonate the user. An httpOnly cookie is never exposed to JavaScript at all - the browser attaches it automatically to requests but page scripts can't read its value - which closes off that specific attack path, though it introduces its own considerations like CSRF protection."
    },

    // Lesson 19 - Swagger & validation
    {
      id: "l19_q1", topic: "Server-side validation", difficulty: "medium",
      question: "A form validates required fields in React before submitting. Is that enough, or does the API still need its own validation? Why?",
      keyPoints: [
        "Client-side validation is a UX convenience, not a security boundary",
        "Any client can bypass the frontend and call the API directly (Postman, scripts)",
        "Server-side validation (e.g. data annotations + [ApiController]) is what actually enforces the rule"
      ],
      modelAnswer: "Client-side validation is not enough on its own - it improves the experience for a well-behaved browser user, but nothing stops someone from bypassing the React form entirely and sending a request straight to the API with Postman, curl, or a script. Any rule that only exists in frontend JavaScript isn't actually enforced. The API needs its own validation - data annotations like [Required] and [StringLength] on the request model, which with [ApiController] automatically produce a 400 response before the action even runs - so the rule holds regardless of how the request arrived."
    },

    // Lesson 20 - SQL Server
    {
      id: "l20_q1", topic: "SQL joins", difficulty: "medium",
      question: "What's the difference between an INNER JOIN and a LEFT JOIN, and when would a query 'lose' rows you expected to see?",
      keyPoints: [
        "INNER JOIN keeps only rows with a match on both sides",
        "LEFT JOIN keeps every row from the left table, with NULLs where there's no right-side match",
        "Using INNER JOIN when you actually needed LEFT JOIN silently drops unmatched rows"
      ],
      modelAnswer: "INNER JOIN only returns rows where the join condition finds a match on both sides - a student with no matching course row simply disappears from the result. LEFT JOIN keeps every row from the left table regardless of whether a match exists, filling in NULLs for the right-hand columns when there isn't one. If you actually wanted 'every student, plus their course if they have one' but wrote an INNER JOIN, students with no enrollments quietly vanish from the results - not an error, just silently missing rows, which makes this a common source of confusing bugs."
    },
    {
      id: "l20_q2", topic: "WHERE vs HAVING", difficulty: "medium",
      question: "Why does WHERE COUNT(*) > 5 fail in a SQL query, and what should you use instead?",
      keyPoints: [
        "WHERE filters individual rows before grouping happens",
        "Aggregate values like COUNT(*) don't exist yet at the WHERE stage",
        "HAVING filters after grouping/aggregation, where aggregates are available"
      ],
      modelAnswer: "WHERE filters rows before they're grouped - at that point in query execution, no aggregation has happened yet, so a value like COUNT(*) simply doesn't exist to filter on, and SQL Server rejects the query. HAVING is the clause designed for this: it runs after GROUP BY has produced its aggregated groups, so HAVING COUNT(*) > 5 correctly filters out groups with five or fewer rows, using the aggregate value that only exists post-grouping."
    },
    {
      id: "l20_q3", topic: "Normalization", difficulty: "hard",
      question: "In plain terms, what problem does database normalization actually solve, and what's the trade-off of pushing it too far?",
      keyPoints: [
        "Normalization removes redundant/duplicated data by splitting it into related tables",
        "Reduces the risk of inconsistent data when the same fact is stored in multiple places",
        "Over-normalizing can require excessive joins, hurting read performance and query simplicity"
      ],
      modelAnswer: "Normalization is about not storing the same fact in more than one place - if a student's name were duplicated on every enrollment row, updating it means finding and fixing every copy, and missing one leaves the data inconsistent. Splitting data into properly related tables (students, courses, enrollments) means each fact lives in exactly one place. The trade-off is that a heavily normalized schema can require many joins to answer a simple question, which adds query complexity and can hurt read performance - real schemas often accept some denormalization deliberately for read-heavy paths."
    },

    // Lesson 21 - MongoDB & deployment
    {
      id: "l21_q1", topic: "SQL vs NoSQL", difficulty: "medium",
      question: "When would you actually reach for MongoDB over SQL Server for a new feature, and what are you giving up by doing so?",
      keyPoints: [
        "MongoDB fits data with a variable or evolving shape better than a fixed schema",
        "Easier horizontal scaling for large, loosely-structured datasets",
        "Trades off some consistency guarantees and strong relational joins that SQL handles natively"
      ],
      modelAnswer: "MongoDB is a better fit when the data's shape varies a lot between records or is expected to evolve quickly - a flexible-schema document naturally accommodates that without a migration every time a field changes, and it scales horizontally with less friction. The trade-off is what you give up: SQL Server's strong relational joins and stricter consistency guarantees, which matter a lot for data where relationships and correctness are critical, like financial or enrollment records. It's a 'pick based on the shape of the problem' decision, not 'NoSQL is always faster'."
    },
    {
      id: "l21_q2", topic: "CORS & deployment", difficulty: "hard",
      question: "Your ASP.NET Core API works perfectly when you test every endpoint in Postman, but the deployed React frontend can't reach it. What's the most likely cause, and why didn't Postman catch it?",
      keyPoints: [
        "Missing or misconfigured CORS policy on the API for the frontend's deployed origin",
        "CORS is enforced by the browser, not the server itself",
        "Postman isn't a browser, so it never triggers or respects CORS restrictions"
      ],
      modelAnswer: "The most likely cause is that the API's CORS policy doesn't allow the frontend's actual deployed origin - it might only allow localhost, or have no CORS configuration at all for that origin. Postman doesn't catch this because CORS is a browser-enforced restriction, not something the server actively blocks requests over; Postman just sends the HTTP request directly and shows you whatever comes back, with no same-origin policy in the way. A real browser, on the other hand, checks the response's CORS headers before letting the frontend's JavaScript read the result, and blocks it client-side if the origin isn't explicitly allowed - which is why 'it works in Postman' can still fail from the live site."
    }
  ]
};
